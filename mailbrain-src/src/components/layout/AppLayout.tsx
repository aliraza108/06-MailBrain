import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

export default AppLayout;

