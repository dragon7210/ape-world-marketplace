/** @format */

import Layout from "components/layout";
import ApeWorld from "pages";
import Bar from "pages/bar";
import Lab from "pages/lab";
import PawnShop from "pages/pawnShop";
import { Route, Routes } from "react-router-dom";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<ApeWorld />} />
      </Route>
      <Route path='/shop' element={<Layout />}>
        <Route index element={<PawnShop />} />
      </Route>
      <Route path='/shop/create' element={<Layout />}>
        <Route index element={<PawnShop />} />
      </Route>
      <Route path='/bar' element={<Layout />}>
        <Route index element={<Bar />} />
      </Route>
      <Route path='/lab' element={<Layout />}>
        <Route index element={<Lab />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
