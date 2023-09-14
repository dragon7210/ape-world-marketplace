import Layout from "components/layout";
import ApeWorld from "pages/apeWorld";
import { Route, Routes } from "react-router-dom";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ApeWorld />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
