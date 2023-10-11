import { ApolloClient, InMemoryCache } from '@apollo/client'
import { APP_URL } from '@/config';

const apolloClient = new ApolloClient({
  uri: APP_URL,
  cache: new InMemoryCache(),
})

export default apolloClient