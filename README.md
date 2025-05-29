# KS3CKC Website

A modern club website for KS3CKC (Kansas City Amateur Radio Club) built with Next.js and TypeScript. This application provides club members and visitors with access to club information, events, and amateur radio resources.

## Technologies

This website is built with modern web technologies:

[🟦 TypeScript](https://www.typescriptlang.org/), [⚛️ React](https://react.dev/), [⚫️ NextJS](https://nextjs.org/), [⚡️ Chakra UI](https://chakra-ui.com/), [🟦 tRPC](https://trpc.io/), [▲ Prisma](https://www.prisma.io/), [🏖️ TanStack Query](https://react-query.tanstack.com/), [📕 Storybook](https://storybook.js.org/), [🎭 Playwright](https://playwright.dev/), [🐜 Formiz](https://formiz-react.com/), [🌍 React i18next](https://react.i18next.com/)


## Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:

- [NodeJS](https://nodejs.org/) >=18
- [Pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (or a [PostgreSQL](https://www.postgresql.org/) database)

### Clone and Setup

1. Clone the repository
```bash
git clone https://github.com/patrickrb/ks3ckc-website.git
cd ks3ckc-website
```

2. Copy environment variables

```bash
cp .env.example .env
```

> [!NOTE]
> **Quick advice for local development**
> - **DON'T update** the **EMAIL_SERVER** variable, because the default value will be used to catch emails during development.

3. Install dependencies
```bash
pnpm install
```

4. Setup and start the database with Docker
```bash
pnpm dk:init
```
> [!NOTE]
> **Don't want to use docker?**
>
> Setup a PostgreSQL database (locally or online) and replace the **DATABASE_URL** environment variable. Then you can run `pnpm db:push` to update your database schema and then run `pnpm db:seed` to seed your database.

## Development Server

Start the development environment:

```bash
# Run the database in Docker (if not already started)
pnpm dk:start
# Run the development server
pnpm dev
```

### Emails in development

#### Maildev to catch emails

In development, the emails will not be sent and will be catched by [maildev](https://github.com/maildev/maildev).

The maildev UI is available at [0.0.0.0:1080](http://0.0.0.0:1080).

#### Preview emails

Emails templates are built with `react-email` components in the `src/emails` folder.

You can preview an email template at `http://localhost:3000/devtools/email/{template}` where `{template}` is the name of the template file in the `src/emails/templates` folder.

Example: [Login Code](http://localhost:3000/devtools/email/login-code)

##### Email translation preview

Add the language in the preview url like `http://localhost:3000/devtools/email/{template}/{language}` where `{language}` is the language key (`en`, `fr`, ...)

#### Email props preview

You can add search params to the preview url to pass as props to the template.
`http://localhost:3000/devtools/email/{template}/?{propsName}={propsValue}`

### Storybook

```bash
pnpm storybook
```

### Update theme typing

When adding or updating theme components, component variations, sizes, colors and other theme foundations, you can extend the internal theme typings to provide nice autocomplete.

Just run the following command after updating the theme:

```bash
pnpm theme:generate-typing
```

### Generate custom icons components from svg files

Put the custom svg files into the `src/components/Icons/svg-sources` folder and then run the following command:

```bash
pnpm theme:generate-icons
```

> [!WARNING]
> All svg icons should be svg files prefixed by `icon-` (example: `icon-externel-link`) with **24x24px** size, only **one shape** and **filled with `#000` color** (will be replaced by `currentColor`).


### Update color mode storage key

You can update the storage key used to detect the color mode by updating this constant in the `src/theme/config.ts` file:

```tsx
export const COLOR_MODE_STORAGE_KEY = 'ks3ckc-color-mode'; // Update the key according to your needs
```

### E2E Tests

E2E tests are setup with Playwright.

```sh
pnpm e2e     # Run tests in headless mode, this is the command executed in CI
pnpm e2e:ui  # Open a UI which allow you to run specific tests and see test execution
```

Tests are written in the `e2e` folder; there is also a `e2e/utils` folder which contains some utils to help writing tests.

## Development Environment Hints

To show environment indicators during development, set these environment variables:

```bash
NEXT_PUBLIC_DEV_ENV_NAME="staging"
NEXT_PUBLIC_DEV_ENV_COLOR_SCHEME="teal"
```

This will display visual indicators in your app to distinguish between different environments.

## Translations

### Setup the i18n Ally extension

We recommended using the [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally) plugin for VS Code for translations management.

Create or edit the `.vscode/settings.json` file with the following settings:

```json
{
  "i18n-ally.localesPaths": ["src/locales"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.enabledFrameworks": ["general", "react", "i18next"],
  "i18n-ally.namespace": true,
  "i18n-ally.defaultNamespace": "common",
  "i18n-ally.extract.autoDetect": true,
  "i18n-ally.keysInUse": ["common.languages.*"]
}
```

## Deployment

This website is deployed on [Vercel](https://vercel.com) for seamless continuous deployment.

### Automatic Deployment

- **Production**: Pushes to the `main` branch are automatically deployed to production
- **Preview**: Pull requests automatically generate preview deployments
- The application uses Vercel's built-in PostgreSQL database and environment variables

### Environment Variables

The following environment variables are required for production deployment:

- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Authentication secret (generate with `openssl rand -base64 32`)
- `EMAIL_SERVER` - SMTP server configuration
- `EMAIL_FROM` - From email address
- `CLOUDLOG_API_KEY` - (Optional) CloudLog API integration
- `CLOUDLOG_API_URL` - (Optional) CloudLog API URL

### Manual Deployment

For manual deployments or other hosting providers:

```bash
pnpm install
pnpm build
pnpm start
```

## Production

### Local Production Build

To test a production build locally:

```bash
pnpm install
pnpm build
pnpm start
```

### Storybook (Optional)

To include Storybook in your build:

```bash
pnpm storybook:build # Will expose Storybook at `/storybook`
```

### Docker Deployment

1. Build the Docker image
```bash
docker build -t ks3ckc-website .
```

2. Run the Docker image
```bash
docker run -p 80:3000 ks3ckc-website
```

The application will be available at [http://localhost](http://localhost).

## Contributing

We welcome contributions to the KS3CKC website! Please see our [GitHub Actions](.github/workflows/) for automated code quality checks and testing that run on all pull requests.

### Code Quality

- **Linting**: ESLint and TypeScript checks run automatically
- **Testing**: Playwright E2E tests ensure functionality
- **Formatting**: Prettier maintains consistent code style

## Authors

- **Patrick Burns** - [@patrickrb](https://github.com/patrickrb)
- **Reid Crowe** - [@Reid-n0rc](https://github.com/Reid-n0rc)

## License

This project is licensed under the MIT License - see the [package.json](package.json) file for details.
