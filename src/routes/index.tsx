import Layout from "components/layout";
import ApeWorld from "pages/apeWorld";
import PawnShop from "pages/apeWorld/pawnShop";
import { Route, Routes } from "react-router-dom";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ApeWorld />} />
      </Route>
      <Route path="/shop" element={<Layout />}>
        <Route index element={<PawnShop />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
