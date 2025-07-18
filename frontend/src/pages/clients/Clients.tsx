import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import ClientCard from "@/components/custom/ClientCard";
import { Funnel, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SideBar from "@/components/custom/Sidebar";
import Header from "@/components/custom/Header";
import { useEffect, useState } from "react";
import { type ClientsDataType } from "@/types/client";
import getClients from "@/utils/api/client/getClients";
import BoxLoader from "@/components/custom/Loaders/BoxLoader";

export const Clients = () => {
  let navigate = useNavigate();

  const {
    data: clientsData,

    isPending,
    isFetched,
    isError,
  } = useQuery({
    queryFn: async () => getClients(),
    queryKey: ["clients"],
  });

  const [clients, setClients] = useState<ClientsDataType[] | undefined>();

  useEffect(() => {
    if (isFetched && clientsData) {
      setClients(clientsData);
    }
  }, [isFetched, clientsData]);

  return (
    <div className=" min-h-screen flex">
      <SideBar />
      <div className="flex flex-col w-full">
        <Header />

        <main className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold ">Clients</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex items-center"
                disabled={isPending}
              >
                <Funnel className="h-4 w-4" />
                Filter
              </Button>

              <Button
                variant="outline"
                disabled={isPending}
                onClick={() => {
                  navigate("/clients/add");
                }}
                className="bg-blue-500 hover:bg-blue-600 hover:text-white flex text-white items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Client
              </Button>
            </div>
          </div>

          <div>
            <Select defaultValue="all" disabled={isPending}>
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
          {isError ? (
            <div className="text-red-500 text-center mt-40">
              Failed to load clients. Please reload again
            </div>
          ) : isPending ? (
            <div className="flex justify-center mt-40">
              <BoxLoader />
            </div>
          ) : !clients || clients.length === 0 ? (
            <div className=" text-center mt-40">
              No clients found. Try adding a new client.
            </div>
          ) : (
            <ClientCard clients={clients!} setClients={setClients} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Clients;
