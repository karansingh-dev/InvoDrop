import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { ChevronDown, Search } from "lucide-react";
import { useUser } from "@/Context/userContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  //getting values from useContext
  const { user, logOut } = useUser();

  return (
    <header className="h-14 py-2 px-4 bg-white sticky top-0 border-b border-gray-200 ">
      <div className="flex items-center justify-between">
        <div className="relative ">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            id="searchBar"
            placeholder="Search..."
            className="w-full rounded-md border border-gray-200 bg-white pl-8 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-blue-500 "
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 border-none hover:bg-slate-100 rounded-sm"
            asChild
          >
            <Button variant="ghost" className="border-none gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="">
                {user?.firstName[0]}. {user?.lastName}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                navigate("/settings/profile");
              }}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate("/settings/company");
              }}
            >
              Company
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate("/settings/profile");
              }}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
