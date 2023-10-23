## CSE 115A: UCSC Course Planner Project

Backend technologies: TypeGraphQL, GraphQL Yoga, PostgreSQL

### Starting the project

1. Run `npm clean install` to download required dependencies
2. Run `npm run prepare` to download Git Hooks (formatting and linting)

- To add your own Git Hooks that do not involve formatting or linting refer to the following link: [Husky](https://typicode.github.io/husky/).

3. Open your .env file (create one if needed) and paste `POSTGRES_PRISMA_URL="postgresql://postgres:postgres@localhost:5432/dev"` into it. This is for connecting to the Postgres database within the docker container.
4. Run `docker-compose up -d` to start the docker container. Make sure Docker is open.
5. Run `npm run init-db` to initialize the postgres db, or directly run `npx prisma migrate dev --name init` and then `npx prisma db seed` to seed the database.
6. Run `npm run dev` to start the application. It should open a new tab to `localhost:3000` with the GraphQL query interface at `localhost:3000/api/graphql`.
7. When you're finished, `Ctrl + C` to exit dev and run `docker-compose down`.
