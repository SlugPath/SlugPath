import { ApolloClient, InMemoryCache } from '@apollo/client'

const prodHost = process.env.VERCEL_URL;
const defaultUrl = "http://localhost:3000/api/graphql";
const url = prodHost ? `https://${prodHost}/api/graphql` : defaultUrl;
const apolloClient = new ApolloClient({
//   uri: '/api/graphql',
  uri: url,
  cache: new InMemoryCache(),
})

export default apolloClient