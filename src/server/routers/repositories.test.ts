import { TRPCError } from '@trpc/server';

import { repositoriesRouter } from '@/server/routers/repositories';

// Mock the extended TRPC error
jest.mock('@/server/config/errors', () => ({
  ExtendedTRPCError: jest
    .fn()
    .mockImplementation(
      (args) => new Error(args.message || 'Extended TRPC Error')
    ),
}));

// Create mock context
const createMockContext = (overrides = {}): any => ({
  user: {
    id: 'user-1',
    email: 'test@example.com',
    authorizations: ['APP', 'ADMIN'] as ('APP' | 'ADMIN')[],
    accountStatus: 'ENABLED' as 'DISABLED' | 'ENABLED' | 'NOT_VERIFIED',
    language: 'en',
  },
  apiType: 'TRPC' as const,
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    fatal: jest.fn(),
    silent: jest.fn(),
    level: 'info' as const,
    child: jest.fn().mockImplementation(() => createMockContext().logger),
  },
  db: {
    repository: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  },
  ...overrides,
});

const mockRepository = {
  id: 'repo-1',
  name: 'Test Repository',
  link: 'https://github.com/test/repo',
  description: 'A test repository',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('repositoriesRouter', () => {
  let mockContext: ReturnType<typeof createMockContext>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockContext = createMockContext();
  });

  describe('getById', () => {
    it('returns repository by id', async () => {
      mockContext.db.repository.findUnique.mockResolvedValue(mockRepository);

      const caller = repositoriesRouter.createCaller(mockContext);

      const result = await caller.getById({ id: 'repo-1' });

      expect(result).toEqual(mockRepository);
      expect(mockContext.db.repository.findUnique).toHaveBeenCalledWith({
        where: { id: 'repo-1' },
      });
      expect(mockContext.logger.info).toHaveBeenCalledWith(
        'Getting repository'
      );
    });

    it('throws NOT_FOUND when repository does not exist', async () => {
      mockContext.db.repository.findUnique.mockResolvedValue(null);

      const caller = repositoriesRouter.createCaller(mockContext);

      await expect(caller.getById({ id: 'non-existent' })).rejects.toThrow(
        TRPCError
      );

      expect(mockContext.logger.warn).toHaveBeenCalledWith(
        'Unable to find repository with the provided input'
      );
    });

    it('validates input id format', async () => {
      const caller = repositoriesRouter.createCaller(mockContext);

      await expect(caller.getById({ id: '' })).rejects.toThrow();
    });

    it('requires authentication', async () => {
      const unauthorizedContext = createMockContext({ user: null });
      const caller = repositoriesRouter.createCaller(unauthorizedContext);

      await expect(caller.getById({ id: 'repo-1' })).rejects.toThrow();
    });

    it('requires proper authorization', async () => {
      const unauthorizedContext = createMockContext({
        user: { ...mockContext.user, authorizations: ['USER'] },
      });
      const caller = repositoriesRouter.createCaller(unauthorizedContext);

      await expect(caller.getById({ id: 'repo-1' })).rejects.toThrow();
    });
  });

  describe('getAll', () => {
    const mockRepositories = [
      { ...mockRepository, id: 'repo-1', name: 'Repository 1' },
      { ...mockRepository, id: 'repo-2', name: 'Repository 2' },
      { ...mockRepository, id: 'repo-3', name: 'Repository 3' },
    ];

    it('returns paginated repositories', async () => {
      mockContext.db.$transaction.mockResolvedValue([
        3, // total count
        mockRepositories.slice(0, 2), // items
      ]);

      const caller = repositoriesRouter.createCaller(mockContext);

      const result = await caller.getAll({ limit: 2 });

      expect(result).toEqual({
        items: mockRepositories.slice(0, 2),
        nextCursor: undefined,
        total: 3,
      });

      expect(mockContext.logger.info).toHaveBeenCalledWith(
        'Getting repositories from database'
      );
    });

    it('handles search term filtering', async () => {
      const filteredRepos = [mockRepositories[0]];

      mockContext.db.$transaction.mockResolvedValue([
        1, // total count
        filteredRepos, // filtered items
      ]);

      const caller = repositoriesRouter.createCaller(mockContext);

      const result = await caller.getAll({
        searchTerm: 'Repository 1',
        limit: 10,
      });

      expect(result).toEqual({
        items: filteredRepos,
        nextCursor: undefined,
        total: 1,
      });

      expect(mockContext.db.$transaction).toHaveBeenCalledWith([
        expect.any(Promise), // count query
        expect.any(Promise), // findMany query
      ]);
    });

    it('handles pagination with cursor', async () => {
      mockContext.db.$transaction.mockResolvedValue([
        3, // total count
        mockRepositories.slice(1, 3), // items starting from cursor
      ]);

      const caller = repositoriesRouter.createCaller(mockContext);

      const result = await caller.getAll({
        cursor: 'repo-1',
        limit: 2,
      });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(3);
    });

    it('calculates next cursor correctly', async () => {
      // Return one more item than limit to test next cursor
      const extendedRepos = [...mockRepositories];

      mockContext.db.$transaction.mockResolvedValue([
        4, // total count
        extendedRepos, // 3 items (limit + 1)
      ]);

      const caller = repositoriesRouter.createCaller(mockContext);

      const result = await caller.getAll({ limit: 2 });

      expect(result.items).toHaveLength(2); // Should pop the extra item
      expect(result.nextCursor).toBe('repo-3'); // Last item's id
    });

    it('uses default parameters', async () => {
      mockContext.db.$transaction.mockResolvedValue([0, []]);

      const caller = repositoriesRouter.createCaller(mockContext);

      await caller.getAll();

      // Should use default limit of 20
      expect(mockContext.db.$transaction).toHaveBeenCalled();
    });

    it('validates limit boundaries', async () => {
      const caller = repositoriesRouter.createCaller(mockContext);

      await expect(caller.getAll({ limit: 0 })).rejects.toThrow();
      await expect(caller.getAll({ limit: 101 })).rejects.toThrow();
    });

    it('handles empty results', async () => {
      mockContext.db.$transaction.mockResolvedValue([0, []]);

      const caller = repositoriesRouter.createCaller(mockContext);

      const result = await caller.getAll({ limit: 10 });

      expect(result).toEqual({
        items: [],
        nextCursor: undefined,
        total: 0,
      });
    });
  });

  describe('create', () => {
    const validInput = {
      name: 'New Repository',
      link: 'https://github.com/test/new-repo',
      description: 'A new test repository',
    };

    it('creates repository successfully', async () => {
      const createdRepo = { ...mockRepository, ...validInput };
      mockContext.db.repository.create.mockResolvedValue(createdRepo);

      const caller = repositoriesRouter.createCaller(mockContext);

      const result = await caller.create(validInput);

      expect(result).toEqual(createdRepo);
      expect(mockContext.db.repository.create).toHaveBeenCalledWith({
        data: validInput,
      });
      expect(mockContext.logger.info).toHaveBeenCalledWith(
        'Creating repository'
      );
    });

    it('validates required fields', async () => {
      const caller = repositoriesRouter.createCaller(mockContext);

      await expect(
        caller.create({
          name: '',
          link: validInput.link,
          description: validInput.description,
        })
      ).rejects.toThrow();

      await expect(
        caller.create({
          name: validInput.name,
          link: '',
          description: validInput.description,
        })
      ).rejects.toThrow();
    });

    it('validates URL format for link', async () => {
      const caller = repositoriesRouter.createCaller(mockContext);

      await expect(
        caller.create({
          ...validInput,
          link: 'not-a-url',
        })
      ).rejects.toThrow();
    });

    it('requires ADMIN authorization', async () => {
      const userContext = createMockContext({
        user: { ...mockContext.user, authorizations: ['APP'] },
      });
      const caller = repositoriesRouter.createCaller(userContext);

      await expect(caller.create(validInput)).rejects.toThrow();
    });

    it('handles database errors', async () => {
      mockContext.db.repository.create.mockRejectedValue(
        new Error('Database error')
      );

      const caller = repositoriesRouter.createCaller(mockContext);

      await expect(caller.create(validInput)).rejects.toThrow();
    });
  });

  describe('updateById', () => {
    const validInput = {
      id: 'repo-1',
      name: 'Updated Repository',
      link: 'https://github.com/test/updated-repo',
      description: 'An updated test repository',
    };

    it('updates repository successfully', async () => {
      const updatedRepo = { ...mockRepository, ...validInput };
      mockContext.db.repository.update.mockResolvedValue(updatedRepo);

      const caller = repositoriesRouter.createCaller(mockContext);

      const result = await caller.updateById(validInput);

      expect(result).toEqual(updatedRepo);
      expect(mockContext.db.repository.update).toHaveBeenCalledWith({
        where: { id: validInput.id },
        data: validInput,
      });
      expect(mockContext.logger.info).toHaveBeenCalledWith(
        'Updating repository'
      );
    });

    it('validates required fields', async () => {
      const caller = repositoriesRouter.createCaller(mockContext);

      await expect(
        caller.updateById({
          ...validInput,
          id: '',
        })
      ).rejects.toThrow();

      await expect(
        caller.updateById({
          ...validInput,
          name: '',
        })
      ).rejects.toThrow();
    });

    it('requires ADMIN authorization', async () => {
      const userContext = createMockContext({
        user: { ...mockContext.user, authorizations: ['APP'] },
      });
      const caller = repositoriesRouter.createCaller(userContext);

      await expect(caller.updateById(validInput)).rejects.toThrow();
    });

    it('handles database errors', async () => {
      mockContext.db.repository.update.mockRejectedValue(
        new Error('Database error')
      );

      const caller = repositoriesRouter.createCaller(mockContext);

      await expect(caller.updateById(validInput)).rejects.toThrow();
    });
  });

  describe('removeById', () => {
    it('removes repository successfully', async () => {
      mockContext.db.repository.delete.mockResolvedValue(mockRepository);

      const caller = repositoriesRouter.createCaller(mockContext);

      const result = await caller.removeById({ id: 'repo-1' });

      expect(result).toEqual(mockRepository);
      expect(mockContext.db.repository.delete).toHaveBeenCalledWith({
        where: { id: 'repo-1' },
      });
      expect(mockContext.logger.info).toHaveBeenCalledWith(
        { input: { id: 'repo-1' } },
        'Removing repository'
      );
    });

    it('validates input id', async () => {
      const caller = repositoriesRouter.createCaller(mockContext);

      await expect(caller.removeById({ id: '' })).rejects.toThrow();
    });

    it('requires ADMIN authorization', async () => {
      const userContext = createMockContext({
        user: { ...mockContext.user, authorizations: ['APP'] },
      });
      const caller = repositoriesRouter.createCaller(userContext);

      await expect(caller.removeById({ id: 'repo-1' })).rejects.toThrow();
    });

    it('handles database errors', async () => {
      mockContext.db.repository.delete.mockRejectedValue(
        new Error('Database error')
      );

      const caller = repositoriesRouter.createCaller(mockContext);

      await expect(caller.removeById({ id: 'repo-1' })).rejects.toThrow();
    });

    it('handles non-existent repository', async () => {
      mockContext.db.repository.delete.mockRejectedValue(
        new Error('Record not found')
      );

      const caller = repositoriesRouter.createCaller(mockContext);

      await expect(caller.removeById({ id: 'non-existent' })).rejects.toThrow();
    });
  });

  describe('repositories integration', () => {
    it('full CRUD operations', async () => {
      const input = {
        name: 'Test CRUD Repository',
        link: 'https://github.com/test/crud-repo',
        description: 'Repository for CRUD testing',
      };

      // Create
      const createdRepo = { ...mockRepository, ...input, id: 'crud-repo' };
      mockContext.db.repository.create.mockResolvedValue(createdRepo);

      const caller = repositoriesRouter.createCaller(mockContext);

      let result = await caller.create(input);
      expect(result.id).toBe('crud-repo');

      // Read
      mockContext.db.repository.findUnique.mockResolvedValue(createdRepo);
      result = await caller.getById({ id: 'crud-repo' });
      expect(result.name).toBe(input.name);

      // Update
      const updateInput = {
        id: 'crud-repo',
        ...input,
        name: 'Updated CRUD Repository',
      };
      const updatedRepo = { ...createdRepo, name: 'Updated CRUD Repository' };
      mockContext.db.repository.update.mockResolvedValue(updatedRepo);

      result = await caller.updateById(updateInput);
      expect(result.name).toBe('Updated CRUD Repository');

      // Delete
      mockContext.db.repository.delete.mockResolvedValue(updatedRepo);
      result = await caller.removeById({ id: 'crud-repo' });
      expect(result).toEqual(updatedRepo);
    });

    it('handles pagination through large dataset', async () => {
      const largeDataset = Array.from({ length: 25 }, (_, i) => ({
        ...mockRepository,
        id: `repo-${i + 1}`,
        name: `Repository ${i + 1}`,
      }));

      // First page
      mockContext.db.$transaction.mockResolvedValueOnce([
        25, // total
        largeDataset.slice(0, 11), // 10 + 1 for next cursor
      ]);

      const caller = repositoriesRouter.createCaller(mockContext);

      let result = await caller.getAll({ limit: 10 });
      expect(result.items).toHaveLength(10);
      expect(result.nextCursor).toBe('repo-11');
      expect(result.total).toBe(25);

      // Second page
      mockContext.db.$transaction.mockResolvedValueOnce([
        25, // total
        largeDataset.slice(10, 21), // next 10 + 1 for next cursor
      ]);

      result = await caller.getAll({
        limit: 10,
        cursor: result.nextCursor,
      });
      expect(result.items).toHaveLength(10);
      expect(result.nextCursor).toBe('repo-21');

      // Last page
      mockContext.db.$transaction.mockResolvedValueOnce([
        25, // total
        largeDataset.slice(20, 25), // remaining 5 items
      ]);

      result = await caller.getAll({
        limit: 10,
        cursor: result.nextCursor,
      });
      expect(result.items).toHaveLength(5);
      expect(result.nextCursor).toBeUndefined(); // No more pages
    });
  });
});
