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
import ClientCard, { type clientsDataType } from "@/components/custom/ClientCard";
import { Funnel, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SideBar from "@/components/custom/Sidebar";
import Header from "@/components/custom/Header";
import { useEffect, useState } from "react";



export const Clients = () => {
    let navigate = useNavigate();

    const { data: client, isLoading, isPending } = useQuery({
        queryFn: async () => fetchClients(), queryKey: ["clients"]
    })

    const [clients, setClients] = useState<clientsDataType[]>();



    useEffect(() => {

        if (!isPending && client) {
            setClients(client);
        }

    }, [isPending, client])


    return <div className="bg-slate-50 min-h-screen flex">
        <SideBar />
        <div className="flex flex-col w-full">
            <Header />


            <main className="flex flex-col gap-6 p-6">

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-90">Clients</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="flex items-center">
                            <Funnel className="h-4 w-4" />
                            Filter
                        </Button>

                        <Button variant="outline" onClick={() => {
                            navigate("/clients/add")
                        }} className="bg-emerald-500 hover:bg-emerald-600 hover:text-white flex text-white items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add New Client

                        </Button>
                    </div>
                </div>

                <div>
                    <Select defaultValue="all">

                        <SelectTrigger id="status" className="mt-1 bg-white w-[180px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>

                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* clients  */}

                {isLoading ? <div className="flex mt-30 justify-center mt-40"> <BoxLoader /></div> : !clients ? <div className="flex mt-30 justify-center mt-40"> <BoxLoader /></div> : clients.length === 0 ? <div className="flex mt-30 justify-center mt-40 text-slate-500">No Clients Exists, Try adding a new client</div> : <ClientCard clients={clients} setClients={setClients} />}


            </main>

        </div>
    </div>






}


export default Clients;