/** @format */

import { useQuery } from "@apollo/client";

export const useCustomQuery = ({
  query,
  variables,
}: {
  query: any;
  variables: any;
}) => {
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
