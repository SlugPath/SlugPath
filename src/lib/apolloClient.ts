import { APP_URL } from "@/config";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: `${APP_URL}/api/graphql`,
  cache: new InMemoryCache(),
});

export default apolloClient;
