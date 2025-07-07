import { BarChart, FileText, House, Users2, Settings } from "lucide-react";
import { Link } from "react-router";
import { useLocation } from "react-router-dom";
import clsx from "clsx";

const SideBar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const mainLinks = [
    { key: "Dashboard", name: "Dashboard", to: "/dashboard", icon: House },
    { key: "Invoices", name: "Invoices", to: "/invoices", icon: FileText },
    { key: "Clients", name: "Clients", to: "/clients", icon: Users2 },
    { key: "Reports", name: "Reports", to: "/reports", icon: BarChart },
  ];

  const settingLinks = [
    { key: "Settings", name: "Settings", to: "/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-white flex flex-col border-r border-slate-200">
      <div className="flex h-14 flex  items-center border-b border-slate-200 px-4">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 rounded-sm p-1">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <Link to="/">
            {" "}
            <span className="font-semibold text-slate-900">InvoDrop</span>
          </Link>
        </div>
      </div>
      <nav className="py-4">
        <div className="px-3 ">
          <h2 className="mb-2 text-xs text-slate-500 font-bold uppercase tracking-wider px-4">
            Main
          </h2>
          <div className="flex flex-col space-y-1">
            {mainLinks.map(({ key, name, to, icon: Icon }) => (
              <Link
                key={key}
                to={to}
                className={clsx(
                  "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium  ",
                  pathname === to
                    ? "bg-emerald-50 text-emerald-600"
                    : "hover:bg-slate-100 text-slate-700"
                )}
              >
                <Icon className="h-4 w-4" />
                {name}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6 px-3">
          <h2 className="mb-2 text-xs text-slate-500 font-bold uppercase tracking-wider px-4">
            Settings
          </h2>
          <div className="flex flex-col space-y-1">
            {settingLinks.map(({ key, name, to, icon: Icon }) => (
              <Link
                key={key}
                to={to}
                className={clsx(
                  "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium  ",
                  pathname === to
                    ? "bg-emerald-50 text-emerald-600"
                    : "hover:bg-slate-100 text-slate-700"
                )}
              >
                <Icon className="h-4 w-4" />
                {name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
