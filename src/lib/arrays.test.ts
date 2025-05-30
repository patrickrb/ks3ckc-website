import { sortByKey } from './arrays';

describe('array utilities', () => {
  describe('sortByKey', () => {
    const testData = [
      { name: 'Charlie', age: 25, score: 85.5 },
      { name: 'Alice', age: 30, score: 92.0 },
      { name: 'Bob', age: 20, score: 78.3 },
    ];

    it('should sort by string values in ascending order by default', () => {
      const sorted = testData.sort(sortByKey('name'));
      expect(sorted.map(item => item.name)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should sort by string values in descending order', () => {
      const sorted = testData.sort(sortByKey('name', 'desc'));
      expect(sorted.map(item => item.name)).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('should sort by numeric values in ascending order', () => {
      const sorted = testData.sort(sortByKey('age'));
      expect(sorted.map(item => item.age)).toEqual([20, 25, 30]);
    });

    it('should sort by numeric values in descending order', () => {
      const sorted = testData.sort(sortByKey('age', 'desc'));
      expect(sorted.map(item => item.age)).toEqual([30, 25, 20]);
    });

    it('should sort by float values correctly', () => {
      const sorted = testData.sort(sortByKey('score'));
      expect(sorted.map(item => item.score)).toEqual([78.3, 85.5, 92.0]);
    });

    it('should handle empty sort key', () => {
      const sorted = [...testData].sort(sortByKey(''));
      // Should return 0 for all comparisons, maintaining original order
      expect(sorted).toEqual(testData);
    });

    it('should handle non-existent keys', () => {
      const sorted = [...testData].sort(sortByKey('nonExistent'));
      // Should compare undefined values as strings
      expect(sorted).toEqual(testData);
    });

    it('should handle mixed string/number data types', () => {
      const mixedData = [
        { value: '10' },
        { value: 5 },
        { value: '2' },
        { value: 20 },
      ];
      const sorted = mixedData.sort(sortByKey('value'));
      expect(sorted.map(item => item.value)).toEqual(['2', 5, '10', 20]);
    });

    it('should handle string values that look like numbers', () => {
      const stringNumberData = [
        { id: '100' },
        { id: '20' },
        { id: '3' },
      ];
      const sorted = stringNumberData.sort(sortByKey('id'));
      expect(sorted.map(item => item.id)).toEqual(['3', '20', '100']);
    });

    it('should handle null and undefined values', () => {
      const nullData = [
        { value: null },
        { value: 10 },
        { value: undefined },
        { value: 5 },
      ];
      const sorted = nullData.sort(sortByKey('value'));
      // null and undefined should be converted to strings and sorted
      expect(sorted.length).toBe(4);
    });
  });
});