/** @format */

import { useCallback, useEffect, useState } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://mainnet.api.worldofv.art/graphql",
  cache: new InMemoryCache(),
});

export const useCustomQuery = ({
  query,
  variables,
}: {
  query: any;
  variables: any;
}) => {
  const [data, setData] = useState<any>()
  const update = useCallback(async () => {
    if (!client || !query) {
      return
    }
    try {
      const response = await client.query({
        query,
        variables,
      })
      setData(response.data)
    } catch (err) {
    }
  }, [query, variables])

  useEffect(() => {
    update()
  }, [update])

  return data;
};
