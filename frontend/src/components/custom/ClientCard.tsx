import {
  Building,
  Edit,
  FileText,
  Mail,
  MoreHorizontal,
  Phone,
  Trash,
  User,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import clsx from "clsx";
import { type Dispatch, type SetStateAction } from "react";
import { apiCall } from "@/utils/api/apiCall";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { ClientsDataType } from "@/types/client";

export const ClientCard = ({
  clients,
  setClients,
}: {
  clients: ClientsDataType[];
  setClients: Dispatch<SetStateAction<ClientsDataType[] | undefined>>;
}) => {
  let navigate = useNavigate();

  const deleteClient = async (clientId: string) => {
    try {
      const result = await apiCall<null>(
        `/delete-client/${clientId}`,
        "DELETE",
        "protected"
      );

      if (result.success) {
        const updated = clients.filter((client) => client.id !== clientId);
        setClients(updated);
        toast.success(result.message || "Client deleted successfully.");
      } else {
        toast.error(result.message || "Failed to delete client.");
      }
    } catch (err) {
      toast.error("Something went wrong while deleting the client.");
      console.error("deleteClient error:", err);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 ">
      {clients.map((client) => {
        return (
          <Card className="rounded-md" key={client.id}>
            <div className="flex items-center -mt-6 justify-between border-b border-gray-200 bg-slate-100 p-4">
              <h3 className="tracking-tight font-semibold text-lg">
                {client.companyName}
              </h3>
              <Badge
                variant={client.status ? "outline" : "secondary"}
                className={clsx(
                  client.status
                    ? "bg-blue-50 text-blue-600 border-blue-600"
                    : "bg-slate-200 text-slate-500"
                )}
              >
                {client.status ? <p>Active</p> : <p>Inactive</p>}
              </Badge>
            </div>
            <CardContent className="">
              <div className="space-y-4 ">
                <div className="flex gap-2">
                  <Mail className="w-4 h-4" />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{client.email}</p>
                    <p className="text-xs text-slate-500">Email</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Phone className="w-4 h-4" />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{client.phoneNumber}</p>
                    <p className="text-xs text-slate-500">Phone Number</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Building className="w-4 h-4" />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {client.streetAddress}, {client.city}, {client.state},{" "}
                      {client.country}
                    </p>
                    <p className="text-xs text-slate-500">Address</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <User className="w-4 h-4" />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {client.contactPersonName}
                    </p>
                    <p className="text-xs text-slate-500">Primary Contact </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 border-t border-gray-200  ">
                <div className="flex items-center justify-between mt-2 ">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {client.invoiceCount} Invoices
                    </p>
                    <p className="text-slate-500 text-xs">
                      $ {client.totalBilledAmount}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      {" "}
                      <MoreHorizontal className="h-4 w-4" />{" "}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="font-medium">
                      <DropdownMenuItem
                        onClick={() => {
                          navigate(`/clients/edit-client/${client.id}`);
                        }}
                        className="gap-3"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {" "}
                        <FileText className="h-4 w-4" /> View Invoices
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          deleteClient(client.id);
                        }}
                      >
                        {" "}
                        <Trash className="w-4 h-4 text-rose-500" /> Delete{" "}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ClientCard;
