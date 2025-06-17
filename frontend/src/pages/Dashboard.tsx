import Header from "@/components/custom/Header"
import SideBar from "@/components/custom/Sidebar"


const DashBoard = () => {

    return <div className="bg-slate-50 min-h-screen flex">
        <SideBar />
        <div className="flex flex-col w-full">
           {/* header */}
            <Header/>


        </div>



    </div>




}


export default DashBoard