/** @format */

import Layout from "components/layout";
import ApeWorld from "pages";
import ErrorPage from "pages/404";
import Bar from "pages/bar";
import Casino from "pages/casino";
import Lab from "pages/lab";
import Mobility from "pages/mobility";
import PawnShop from "pages/pawnShop";
import Ship from "pages/ship";
import Store from "pages/store";
import Jungle from "pages/jungle";
import { Navigate, Route, Routes } from "react-router-dom";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path='/'>
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
      <Route path='/bar/info' element={<Layout />}>
        <Route index element={<Bar />} />
      </Route>
      <Route path='/lab' element={<Layout />}>
        <Route index element={<Lab />} />
      </Route>
      <Route path='/lab/call' element={<Layout />}>
        <Route index element={<Lab />} />
      </Route>
      <Route path='/lab/put' element={<Layout />}>
        <Route index element={<Lab />} />
      </Route>
      <Route path='/store' element={<Layout />}>
        <Route index element={<Store />} />
      </Route>
      <Route path='/store/create' element={<Layout />}>
        <Route index element={<Store />} />
      </Route>
      <Route path='/ship' element={<Layout />}>
        <Route index element={<Ship />} />
      </Route>
      <Route path='/ship/create' element={<Layout />}>
        <Route index element={<Ship />} />
      </Route>
      <Route path='/casino' element={<Layout />}>
        <Route index element={<Casino />} />
      </Route>
      <Route path='/mobility' element={<Layout />}>
        <Route index element={<Mobility />} />
      </Route>
      <Route path='/jungle' element={<Layout />}>
        <Route index element={<Jungle />} />
      </Route>
      <Route path='/404' element={<Layout />}>
        <Route index element={<ErrorPage />} />
      </Route>
      <Route path='*' element={<Navigate to='/404' />}></Route>
    </Routes>
  );
};

export default MainRoutes;
