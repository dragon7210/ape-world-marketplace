/** @format */

import Toast from "components/common/Toast";
import ContextProviders from "contexts";
import { BrowserRouter } from "react-router-dom";
import MainRoutes from "routes";
import { useSelector } from "react-redux";
import Spinner from "components/common/Spinner";

function App() {
  const { loading } = useSelector((state: any) => state.loading);
  return (
    <ContextProviders>
      <BrowserRouter>
        <MainRoutes />
        <Toast />
        <Spinner loading={loading} />
      </BrowserRouter>
    </ContextProviders>
  );
}

export default App;
