import { APP_URL } from '@/config';
import { useState, useEffect } from 'react';
import { MemberQueryResult } from '@/app/ts-types/GraphQL';
import { GraphQLQueryError } from '@/app/ts-types/Errors';

// a graphQL query and any variables
export function useMemberQuery(query: string) {
  const [data, setData] = useState<MemberQueryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<GraphQLQueryError | null>(null);

  useEffect(() => {
    // Define the GraphQL endpoint URL
    console.log(`APP_URL=${APP_URL}`)
    const endpoint = `${APP_URL}/api/graphql`;

    // Define the GraphQL request options
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    };

    fetch(endpoint, options)
      .then((response) => response.json())
      .then((result) => {
        setData(result.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [query]);

  return { data, loading, error };
}
