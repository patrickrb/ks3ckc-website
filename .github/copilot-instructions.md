# Copilot Custom Instructions for KS3CKC Website

This is a Next.js (React) and TypeScript repository, styled primarily with Tailwind CSS. It serves as the website for the KS3CKC amateur radio club and related community activities. Please follow these guidelines when contributing:

## Code Standards

### Required Before Each Commit
- Run `npm run lint` and `npm run format` before committing any changes to ensure code quality and consistent style
- `npm run lint` uses ESLint rules defined in `.eslintrc.json`
- `npm run format` uses Prettier configuration in `.prettierrc.js`

### Development Flow
- Build: `npm run build`
- Test: `npm run test`
- Start local dev server: `npm run dev`
- Run all checks (format, lint, test): `npm run check`

## Repository Structure
- `pages/`: Next.js pages and route handlers
- `components/`: Reusable React components
- `lib/`: Utility modules (e.g., data fetching, string helpers)
- `styles/`: Tailwind CSS and global styles
- `public/`: Static files (images, robots.txt, favicon, etc.)
- `tests/`: Unit and integration tests (Jest)
- `api/`: (If present) Next.js API route handlers
- `docs/`: Project documentation and guides

## Key Guidelines
1. **Frameworks**: All new code should use Next.js, React, and TypeScript conventions.
2. **Styling**: Use Tailwind CSS utility classes. Avoid plain CSS unless absolutely necessary.
3. **Code Organization**: Place files in their appropriate folders; keep components and utilities reusable.
4. **Testing**: Write Jest unit tests for new components and utilities. Name test files as `ComponentName.test.tsx` or `util.test.ts`.
5. **Accessibility**: Follow WCAG guidelines; use semantic HTML and ARIA attributes where needed.
6. **Performance**: Use Next.js `<Image />` for images; optimize assets for web delivery.
7. **Commit Messages**: Use Conventional Commits (e.g., `feat:`, `fix:`, `chore:`) for all commit messages.
8. **Documentation**: Update `README.md` and `docs/` for major changes or new features. Add code comments for complex logic.

## Additional Notes
- **Secrets**: Never commit API keys, secrets, or sensitive data. Use `.env.local` for local environment variables.
- **Dependencies**: Prefer lightweight, actively maintained NPM packages.
- **PR Reviews**: All pull requests should pass CI checks and be reviewed before merging.

Thank you for helping keep KS3CKC’s website high quality and consistent!
