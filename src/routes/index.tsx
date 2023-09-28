/** @format */

import Layout from "components/layout";
import ApeWorld from "pages";
import Bar from "pages/bar";
import Casino from "pages/casino";
import Jungle from "pages/jungle";
import Lab from "pages/lab";
import PawnShop from "pages/pawnShop";
import RealState from "pages/realState";
import Ship from "pages/ship";
import Store from "pages/store";
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
      <Route path='/store' element={<Layout />}>
        <Route index element={<Store />} />
      </Route>
      <Route path='/realState' element={<Layout />}>
        <Route index element={<RealState />} />
      </Route>
      <Route path='/ship' element={<Layout />}>
        <Route index element={<Ship />} />
      </Route>
      <Route path='/casino' element={<Layout />}>
        <Route index element={<Casino />} />
      </Route>
      <Route path='/jungle' element={<Layout />}>
        <Route index element={<Jungle />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
