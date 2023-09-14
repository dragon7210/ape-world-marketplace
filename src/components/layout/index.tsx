import { FC, PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-between">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
