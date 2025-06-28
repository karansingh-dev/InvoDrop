import { Input } from "../ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button";
import { ChevronDown, Loader, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "@/utils/api/getUserData";




const Header = () => {

    let navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
   

    const routes = ["/dashboard", "/clients", "/reports", "/invoices"]


    const token = sessionStorage.getItem("token");

    const { data: user, isLoading } = useQuery({
        queryFn: async () => getUserData(), queryKey: ["user"]
    })


    const matched = routes.find((route) => route == pathname);
     
   


    if (!token || !matched) {
        return <div></div>
    }




    return <header className="h-14 py-2 px-4 bg-white sticky top-0 border-b border-slate-200 ">

        <div className="flex items-center justify-between">
            <div className="relative ">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-md border border-slate-200 bg-white pl-8 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500 "
                />
            </div>

            {isLoading ? <div className="flex justify-center items-center mr-10">
                <Loader className="animate-spin w-6 h-6 text-gray-100" />
            </div> :
                user == undefined ? <div className="flex justify-center items-center mr-10 text-rose-500">error</div> : <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 border-none hover:bg-slate-100 rounded-sm" asChild>
                        <Button variant="ghost" className="border-none gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="hidden md:inline">{user.firstName[0]}. {user.lastName}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Company</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                            sessionStorage.removeItem("token")
                            navigate("/");
                            navigate(0);

                        }}>Logout</DropdownMenuItem>


                    </DropdownMenuContent>
                </DropdownMenu>


            }

        </div>



    </header >



}

export default Header;