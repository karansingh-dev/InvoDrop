import Header from "@/components/custom/Header";
import SideBar from "@/components/custom/Sidebar";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query";
import { fetchClients } from "@/utils/api/fetchClients";
import BoxLoader from "@/components/custom/BoxLoader";
import ClientCard from "@/components/custom/ClientCard";
import { Funnel, Plus } from "lucide-react";



export const Clients = () => {

    const { data: client, isLoading } = useQuery({
        queryFn: async () => fetchClients(), queryKey: ["clients"]
    })



    return (
        <div className="bg-slate-50 min-h-screen flex">
            {/*side navbar*/}
            <SideBar />
            <div className="flex flex-col w-full">
                {/* header */}
                <Header />

                {/* main section  */}

                <main className="flex flex-col gap-6 p-6">

                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-90">Clients</h1>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="flex items-center">
                                <Funnel className="h-4 w-4" />
                                Filter
                            </Button>

                            <Button variant="outline" className="bg-emerald-500 hover:bg-emerald-600 hover:text-white flex text-white items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                Add Client

                            </Button>
                        </div>
                    </div>

                    <div>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" className="bg-white" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* clients  */}

                    {isLoading ? <div className="flex mt-30 justify-center mt-40"><BoxLoader /> </div> :
                        <ClientCard client={client} />
                    }

                </main>


            </div>



        </div>
    )

}


export default Clients;