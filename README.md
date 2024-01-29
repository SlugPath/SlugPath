# Slug Path aka UCSC Course Planner

> A course planner for UCSC students

## About

UCSC currently does not have an interactive and aesthetically pleasing course planner that provides basic validation
for academic plans. Our aim with this project is to meet that demand in the student body, starting with the CSE
department.

## Getting started

```
git clone https://github.com/fercevik729/UCSC-Course-Planner
pnpm install
pnpx prisma generate
```

Make sure to have the `POSTGRES_PRISMA_URL` env variable set, along with any other env variables if you choose to use Docker. Moreover, some additional env variables are required at build time but not necessarily needed for local development. You might want to set some mock values for these.

```
docker-compose --env-file=<your-env-file.env> up -d (optional)
pnpm run init-db
```

This will initialize the database with the correct schema and initial data.
Finally run the project with

```
pnpm run dev
```

Et Voilà! The app should be running on `localhost:3000`.

## Authors

- **Furkan Ercevik** - [fercevik729](https://github.com/fercevik729)
- **Oskar Luthje** - [oluthje](https://github.com/oluthje)
- **Teresa Wu** - [tqwu](https://github.com/tqwu)
- **Ahmad Joseph** - [aajoseph-dev](https://github.com/aajoseph-dev)
- **Lily Knab** - [lilyknab](https://github.com/lilyknab)

## Contributing

After downloading the project files and the dependencies make sure to install the necessary GitHooks for linting and formatting with

```
pnpm run prepare
```

> To add your own Git Hooks beyond formatting or linting refer [here](https://typicode.github.io/husky/).

Make sure to add relevant tests and run them and view coverage details with

```
pnpm run test
```

Before running tests make sure that your local instance of the database contains the up-to-date schema with

```
pnpx prisma migrate deploy
```

Before starting work on an issue make sure that it has not been assigned already or has not been actively worked on recently.
Create PR's onto the `dev` branch upon completion of work, and we will review it and merge it as soon as possible.

## Deployment

We use Vercel to deploy as it is the most convenient way to deploy a Next.js application.

## Database Information

- To backup any existing data in a database use the `pg_dump "<connection string>" > outfile.sql` command
- To restore from backup use `psql "<connection string>" < outfile.sql`
- Make sure to create and deploy migrations whenever the schema is changed

## Built With

- [Next.js](https://nextjs.org/) and [React](https://react.dev/)
- [Material UI](https://github.com/mui/material-ui)
- [Prisma](https://www.prisma.io/)
- [graphql-yoga](https://github.com/dotansimha/graphql-yoga) + [apollo-client](https://github.com/apollographql/apollo-client) + [type-graphql](https://github.com/MichalLytek/type-graphql)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
