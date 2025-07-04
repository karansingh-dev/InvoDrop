import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Currency,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createInvoiceSchema } from "@/validations/invoice/createInvoiceSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Item } from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import type { invoiceItemSchema } from "@/validations/invoice/invoiceItemSchema";
import { apiCall } from "@/utils/api/apiCall";
import { useParams } from "react-router-dom";
import {
  getOneInvoiceForEdit,
  type editclientDataType,
} from "@/utils/api/fetchInvoiceForEdit";
import { getClientsForEdit } from "@/utils/api/fetchClientsForInvoiceEdit";

type Item = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
};

type createInvoice = z.infer<typeof createInvoiceSchema>;

type Currency = "Rupees" | "Dollar" | "Euro" | "Pound" | "Yen";

type invoiceItem = z.infer<typeof invoiceItemSchema>;

export const EditInvoice = () => {
  let navigate = useNavigate();

  const params = useParams();

  const invoiceId = params.invoiceId;

  const [loading, setLoading] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>("select");

  const { data: invoice, isLoading } = useQuery({
    queryFn: async () => getOneInvoiceForEdit(invoiceId!),
    queryKey: ["preData"],
    enabled: !!invoiceId,
  });

  const { data: clients } = useQuery({
    queryFn: async () => getClientsForEdit(),
    queryKey: ["clients"],
  });

  const [Items, setItems] = useState<Item[]>([]);

  const { handleSubmit, getValues, setValue, watch, reset } = useForm<
    z.infer<typeof createInvoiceSchema>
  >({
    resolver: zodResolver(createInvoiceSchema),
  });

  const [selectedClient, setSelectedClient] = useState<editclientDataType>();

  useEffect(() => {
    if (invoice) {
      reset({
        issueDate: new Date(invoice.issueDate),
        dueDate: new Date(invoice.dueDate),
        currency: invoice.currency,
        subTotal: Number(invoice.subTotal),
        grandTotal: Number(invoice.grandTotal),

        clientEmail: invoice.client.email,
        taxPercent: Number(invoice.taxPercent),

        notes: invoice.notes,
      });

      const newitems = invoice.items.map((item, index) => {
        return {
          id: String(index + 1),
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          price: Number(item.unitPrice),
          total: Number(item.totalPrice),
        };
      });

      const invoiceItems = invoice.items.map((item) => {
        return {
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.totalPrice),
        };
      });
      setValue("invoiceItems", invoiceItems);

      setItems(newitems);

      setCurrency(invoice.currency);
      setSelectedClient(invoice.client);
    }
  }, [invoice]);

  const taxPercent = Number(watch("taxPercent"));

  const subTotal: number = Items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subTotal * (taxPercent / 100);
  const grandTotal = taxAmount + subTotal;

  const addItem = () => {
    const newId = String(Items.length + 1);
    setItems([
      ...Items,
      { id: newId, name: "", description: "", quantity: 1, price: 0, total: 0 },
    ]);
  };

  const removeItems = (id: string) => {
    if (Items.length > 1) {
      setItems(Items.filter((item) => item.id !== id));
    } else {
      toast.error("You must have at least one line item");
    }
  };

  const updateItems = (
    id: string,
    field: keyof Item,
    value: string | number
  ) => {
    setItems(
      Items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate total if quantity or price changes
          if (field === "quantity" || field === "price") {
            updatedItem.total =
              Number(updatedItem.quantity) * Number(updatedItem.price);
          }
          return updatedItem;
        }
        return item;
      })
    );

    setValue("subTotal", subTotal);
    setValue("grandTotal", grandTotal);

    const invoiceItems: invoiceItem[] = Items.map((item) => {
      return {
        name: item.name,
        description: item.description,
        unitPrice: item.price,
        quantity: item.quantity,
        totalPrice: item.total,
      };
    });
    setValue("invoiceItems", invoiceItems);
  };

  const issueDate = watch("issueDate");
  const dueDate = watch("dueDate");

  const onSubmit: SubmitHandler<z.infer<typeof createInvoiceSchema>> = async (
    data
  ) => {
    setLoading(true);
    const res = await apiCall<createInvoice>(
      `/edit-invoice/${invoiceId}`,
      "PUT",
      "protected",
      data
    );

    if (res.success) {
      toast.success(res.message);
      setLoading(false);
      navigate("/invoices");
    } else {
      toast.error(res.message);
      setLoading(false);
    }
  };

  const onError = (errors: any) => {
    console.error("❌ Zod Validation Errors:", errors);
    toast.error("Validation failed. Please check your inputs.");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center gap-2">
        {" "}
        <Loader2 className="animate-spin w-6 h-6 text-emerald-500 mt-30" />{" "}
        <span className="mt-30 text-emerald-500">Loading...</span>
      </div>
    );

  if (invoice && clients && selectedClient)
    return (
      <div className="bg-slate-50 min-h-screen w-full flex flex-col">
        {/* header section  */}
        <header className="flex items-center justify-between px-6 h-14 bg-white sticky top-0">
          <div className="flex gap-4 items-center">
            <Button
              variant="ghost"
              onClick={() => {
                navigate("/invoices");
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <h1 className="text-lg font-bold text-slate-900">Update Invoice</h1>
          </div>

          <Button
            variant="outline"
            onClick={handleSubmit(onSubmit, onError)}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 hover:text-white"
          >
            {loading ? (
              <Loader2 className="animate-spin w-12 h-12 text-white" />
            ) : (
              <div className="flex justify-center items-center gap-2 text-white">
                <Save className="h-4 w-4" />
                <span className="text-md">Save & Send</span>
              </div>
            )}
          </Button>
        </header>

        <main className="flex justify-center mt-5  w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="w-300">
            <div className="flex flex-col gap-6">
              {/* client and Invoice details  */}
              <div className="flex gap-10 h-80">
                <Card className="w-150 rounded-md ">
                  <CardHeader>
                    <CardTitle>
                      <h2 className="text-xl"> Client Information</h2>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="">
                      <Label className="text-sm font-medium">
                        Select Client
                      </Label>
                      <Select
                        value={selectedClient?.email}
                        onValueChange={(email) => {
                          const foundClient = clients.find(
                            (client) => client.email === email
                          );

                          if (foundClient) {
                            setSelectedClient(foundClient);

                            setValue("clientEmail", email);
                          }
                        }}
                      >
                        <SelectTrigger
                          id="status"
                          className="mt-2 bg-white w-full"
                        >
                          <SelectValue placeholder="Select Client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="select">
                            Select a Client
                          </SelectItem>
                          {clients.map((client) => {
                            return (
                              <SelectItem
                                key={client.companyName}
                                value={client.email}
                              >
                                {client.companyName}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {!!selectedClient ? (
                      <div className=" mt-4 border-1 border-slate-200 p-3 rounded-lg">
                        <p className="text-sm font-medium">
                          {selectedClient.companyName}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {selectedClient.email}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">{`${selectedClient.streetAddress}, ${selectedClient.city}, ${selectedClient.state}, ${selectedClient.country}`}</p>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </CardContent>
                </Card>

                <Card className="min-w-150 rounded-md">
                  <CardHeader>
                    <CardTitle>
                      <h2 className="text-xl">Invoice Details</h2>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6">
                    <div>
                      <Label className="text-sm font-medium">
                        Invoice Number
                      </Label>
                      <p className="border-2 mt-2 rounded-sm text-sm p-1 font-semibold">
                        {" "}
                        {invoice.invoiceNumber}{" "}
                      </p>
                    </div>

                    <div className="flex gap-15">
                      <div>
                        <Label
                          htmlFor="issueDate"
                          className="text-sm font-medium"
                        >
                          Issue Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild id="issueDate">
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <Calendar className="mr-1 h-4 w-4" />
                              {issueDate &&
                              !isNaN(new Date(issueDate).getTime())
                                ? new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }).format(new Date(issueDate))
                                : "Invalid or missing date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={getValues("issueDate")}
                              onSelect={(date) => {
                                if (date !== undefined)
                                  setValue("issueDate", new Date(date));
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label
                          htmlFor="dueDate"
                          className="text-sm font-medium"
                        >
                          Due Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild id="dueDate">
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <Calendar className="mr-1 h-4 w-4" />
                              {dueDate && !isNaN(new Date(dueDate).getTime())
                                ? new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }).format(new Date(dueDate))
                                : "Invalid or missing date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={getValues("dueDate")}
                              onSelect={(date) => {
                                if (date !== undefined) {
                                  setValue("dueDate", new Date(date));
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="currency">Select Currency</Label>
                      <Select
                        value={currency}
                        onValueChange={(currency: Currency) => {
                          if (currency) {
                            setCurrency(currency);

                            setValue("currency", currency);
                          }
                        }}
                      >
                        <SelectTrigger
                          id="currency"
                          className="mt-2 bg-white w-full"
                        >
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="select">
                            Select Currency
                          </SelectItem>
                          <SelectItem value="Rupees">Rupees</SelectItem>
                          <SelectItem value="Dollar">Dollar</SelectItem>
                          <SelectItem value="Euro">Euro</SelectItem>
                          <SelectItem value="Pound">Pound</SelectItem>
                          <SelectItem value="Yen">Yen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* items  */}
              <Card className="rounded-md">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl">Items Detail</h2>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={addItem}
                        className="hover:bg-emerald-50 text-emerald-500 hover:text-emerald-500"
                      >
                        <Plus className="h-4 w-4 mr-2 text-emerald-500 " /> Add
                        Item
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="mt-5 flex justify-center space-y-4">
                  {/* item  */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-[150px_500px_80px_100px_120px_40px]  gap-4 text-sm font-medium text-slate-500 px-3 ">
                      <div>Name</div>
                      <div>Description</div>
                      <div>Quantity</div>
                      <div>Price</div>
                      <div>Total</div>
                      <div></div>
                    </div>

                    {Items.map((item) => {
                      return (
                        <div
                          key={item.id}
                          className="grid grid-cols-[150px_500px_80px_100px_120px_40px]  gap-4 "
                        >
                          <div>
                            <Input
                              placeholder="Item Name"
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                updateItems(item.id, "name", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Input
                              placeholder=" Item Description"
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                updateItems(
                                  item.id,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItems(
                                  item.id,
                                  "quantity",
                                  e.target.valueAsNumber
                                )
                              }
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                updateItems(
                                  item.id,
                                  "price",
                                  e.target.valueAsNumber
                                )
                              }
                            />
                          </div>
                          <div>
                            <Input
                              readOnly
                              className="bg-slate-50"
                              type="number"
                              value={item.total}
                            />
                          </div>
                          {Items.length > 1 && (
                            <div>
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  removeItems(item.id);
                                }}
                                className="hover:text-rose-500 ml-5"
                              >
                                <X className="w-4 h-4 " />
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter className="px-0 flex justify-end border-t border-slate-200">
                  <div className=" pr-10 flex flex-col">
                    <div className="flex w-64 justify-between items-center ">
                      <span className="text-md text-slate-500">Subtotal:</span>
                      <span className="font-medium">
                        ${subTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex w-64 justify-between items-center mt-1 ">
                      <div className="flex gap-2 items-center ">
                        <span className="text-md text-slate-500">Tax :</span>
                        <Input
                          className="w-20 h-6 rounded-sm"
                          onChange={(e) => {
                            setValue("taxPercent", e.target.valueAsNumber);
                          }}
                          type="number"
                          value={taxPercent || 0}
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <span className="font-medium">
                        {taxAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex w-64 justify-between items-center mt-4 py-2 border-t border-slate-200 ">
                      <span className="text-md text-slate-500">
                        Grandtotal:
                      </span>
                      <span className="font-medium">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    <h2 className="text-lg">Notes</h2>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div>
                    <Label htmlFor="notes">Notes (visible to client)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter any notes for the client..."
                      value={getValues("notes")}
                      onChange={(e) => {
                        setValue("notes", e.target.value);
                      }}
                      className="min-h-[100px] bg-white mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </main>
      </div>
    );
};
