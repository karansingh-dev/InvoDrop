import Header from "@/components/custom/Header";
import SideBar from "@/components/custom/Sidebar";

export const Reports = () => {
  return (
    <div className=" min-h-screen flex">
      <SideBar />
      <div className="flex flex-col w-full">
        <Header />

        <main>
            Building this page
        </main>
      </div>
    </div>
  );
};
