import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen">
      <div className="h-20 md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 fixed inset-y-0 flex-col z-50">
        <Sidebar />
      </div>
      <main className="pl-56">{children}</main>
    </div>
  );
};

export default DashboardLayout;
