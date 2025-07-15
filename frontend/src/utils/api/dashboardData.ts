import { apiCall } from "./apiCall";

type dashboardData = {
  totalRevenue: number;
  recentInvoices: {
    id: string;
    invoiceNumber: string;
    grandTotal: string;
    issueDate: Date;
    dueDate: Date;
    status: string;
    companyName: string;
  }[];
  invoicesCount: number;
  clientsCount: number;
  pendingInvoicesAmount: number;
  recentActivities:{
    description:string
    createdAt: Date
  }[]
};

export const getDashBoardData = async () => {
  const response = await apiCall<dashboardData>(
    "/get-dashboard-data/30",
    "GET",
    "protected"
  );
  if (response.data == undefined) {
    throw new Error("Failed to get dashboard data");
  }

  return response;
};
