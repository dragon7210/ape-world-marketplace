/** @format */

import Toast from "components/common/Toast";
import ContextProviders from "contexts";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import MainRoutes from "routes";

function App() {
  const client = new ApolloClient({
    uri: "https://mainnet.api.worldofv.art/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <ContextProviders>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <MainRoutes />
          <Toast />
        </BrowserRouter>
      </ApolloProvider>
    </ContextProviders>
  );
}

export default App;
