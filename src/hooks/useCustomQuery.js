/** @format */

import { useQuery } from "@apollo/client";

export const useCustomQuery = ({ query, variables }) => {
  const { data, error, loading } = useQuery(query, {
    variables: variables,
  });
  if (loading) {
    return null;
  }
  if (error) {
    return `Error+${error}`;
  }
  return data;
};
