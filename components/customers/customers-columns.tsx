import { ColumnDef, HeaderContext, Row } from "@tanstack/react-table";
import { Customer } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Actions from "@/components/form/form-actions";

interface CustomerColumnsProps {
  currentUser: { role: string } | undefined;
  deletingCustomerId: string | null;
  setDeletingCustomerId: (id: string | null) => void;
  handleEditCustomer: (customer: Customer) => void;
  onCustomerDeletedHandler: () => void;
}

export const getCustomerColumns = ({
  currentUser,
  deletingCustomerId,
  setDeletingCustomerId,
  handleEditCustomer,
  onCustomerDeletedHandler,
}: CustomerColumnsProps): ColumnDef<Customer>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    ...(currentUser?.role === "ADMIN"
      ? [
          {
            accessorFn: (row: Customer) => {
              return row.users?.[0]?.user?.name ?? "N/A";
            },
            id: "associatedUser",
            header: ({ column }: HeaderContext<Customer, unknown>) => (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                User
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            ),
            cell: ({ row }: { row: Row<Customer> }) => (
              <div>{row.original.users?.[0]?.user?.name ?? "N/A"}</div>
            ),
          },
        ]
      : []),
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const address = row.getValue("address");
        return <div>{address ? String(address) : "No address provided"}</div>;
      },
    },
    {
      accessorKey: "companyName",
      header: "Company Name",
      cell: ({ row }) => <div>{row.getValue("companyName")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original as Customer;

        return (
          <Actions
            id={customer.id}
            onEdit={() => handleEditCustomer(customer)}
            onDelete={() => onCustomerDeletedHandler()}
            deletingId={deletingCustomerId}
            setDeletingId={setDeletingCustomerId}
            currentUser={currentUser}
          />
        );
      },
    },
  ];
};
