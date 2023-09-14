import Toast from "components/common/Toast";
import ContextProviders from "contexts";
import { BrowserRouter } from "react-router-dom";
import MainRoutes from "routes";

function App() {
  return (
    <ContextProviders>
      <BrowserRouter>
        <MainRoutes />
        <Toast />
      </BrowserRouter>
    </ContextProviders>
  );
}

export default App;
