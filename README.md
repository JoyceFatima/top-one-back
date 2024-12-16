# Top One API

This project is a NestJS-based API designed to provide robust and scalable backend services. Below is a detailed description of the primary scripts available in the `package.json`.

## Getting Started

To start working with this project, make sure you have Node.js installed. You can use `npm` to install the dependencies and run the scripts.

### Installation

Run the following command to install the project dependencies:

```bash
npm install
```

## Available Scripts

### Build and Start Scripts

- **`build`**: Compiles the project into the `dist` folder.

  ```bash
  npm run build
  ```

- **`start`**: Starts the application in production mode.

  ```bash
  npm run start
  ```

- **`start:dev`**: Starts the application in development mode with hot reloading enabled.

  ```bash
  npm run start:dev
  ```

- **`start:debug`**: Starts the application in debug mode with hot reloading enabled.

  ```bash
  npm run start:debug
  ```

- **`start:prod`**: Runs the compiled application from the `dist` folder.
  ```bash
  npm run start:prod
  ```

### Code Quality and Formatting

- **`format`**: Formats the codebase using Prettier.

  ```bash
  npm run format
  ```

- **`lint`**: Lints the codebase using ESLint and attempts to fix issues automatically.
  ```bash
  npm run lint
  ```

### Testing

- **`test`**: Runs all tests using Jest.

  ```bash
  npm run test
  ```

- **`test:watch`**: Runs tests in watch mode.

  ```bash
  npm run test:watch
  ```

- **`test:cov`**: Runs tests and generates a coverage report.

  ```bash
  npm run test:cov
  ```

- **`test:debug`**: Runs tests in debug mode.

  ```bash
  npm run test:debug
  ```

- **`test:e2e`**: Runs end-to-end tests with a custom Jest configuration.
  ```bash
  npm run test:e2e
  ```

### Database Migration Scripts

These scripts use TypeORM to manage database migrations.

- **`migration:show`**: Displays the list of pending migrations.

  ```bash
  npm run migration:show
  ```

- **`migration:create`**: Creates a new migration file in the `src/common/database/migrations/` directory. You must specify the migration name:

  ```bash
  npm run migration:create --name=your-migration-name
  ```

- **`migration:generate`**: Generates a new migration file based on changes in the database schema. You must specify the migration name:

  ```bash
  npm run migration:generate --name=your-migration-name
  ```

- **`migration:run`**: Applies all pending migrations to the database.

  ```bash
  npm run migration:run
  ```

- **`migration:revert`**: Reverts the last applied migration.
  ```bash
  npm run migration:revert
  ```

### Seeding the Database

- **`seed`**: Runs the seeding script located in `src/seed.ts` to populate the database with initial data.
  ```bash
  npm run seed
  ```

### TypeORM CLI

For advanced database operations, you can use the TypeORM CLI directly:

- **`typeorm:cli`**: Executes the TypeORM CLI with the data source file `src/common/database/data-source.ts`. For example:
  ```bash
  npm run typeorm:cli migration:show
  ```

## Additional Information

- **Dependencies**: Check the `dependencies` and `devDependencies` sections in `package.json` for the libraries used in this project.
- **Testing**: Jest is used for unit and end-to-end testing. The configuration is located in `jest` within the `package.json`.

For further assistance, consult the NestJS [documentation](https://docs.nestjs.com/) or TypeORM [documentation](https://typeorm.io/).
