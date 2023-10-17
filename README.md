## CSE 115A: UCSC Course Planner Project

Backend technologies: TypeGraphQL, GraphQL Yoga, PostgreSQL

### Starting the project
1. Run `npm install` to download required dependencies
2. Open your .env file (create one if needed) and paste `POSTGRES_PRISMA_URL="postgresql://postgres:postgres@localhost:5432/dev"` into it. This is for connecting to the Postgres database within the docker container.
3. Run `docker-compose up -d` to start the docker container. Make sure Docker is open.
4. Run `npx prisma migrate dev --name init` and then `npx prisma db seed` to seed the database.
5. Run `npm run dev` to start the application. It should be viewable at `localhost:3000` with the GraphQL query interface at `localhost:3000/api/graphql`.
6. When you're finished, `Ctrl + c` to exit dev and run `docker-compose down`.
