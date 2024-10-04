"use client";

import { Button } from "@/components/ui/button";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { usePathname } from "next/navigation";

interface ActionsProps {
  id: string;
  status?: string;
  onPreview?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  deletingId?: string | null;
  setDeletingId?: (id: string | null) => void;
  currentUser: { role: string } | undefined;
}

const Actions: React.FC<ActionsProps> = ({
  id,
  status,
  onPreview,
  onEdit,
  onDelete,
  deletingId,
  setDeletingId,
  currentUser,
}) => {
  const pathname = usePathname();

  const isCustomerPage = pathname.includes("customers");
  const isInvoicePage = pathname.includes("invoices");
  const isPaymentPage = pathname.includes("payments");
  const isUserPage = pathname.includes("users");

  const isAdmin = currentUser?.role === "ADMIN";
  const isUser = currentUser?.role === "USER";
  const isCustomer = currentUser?.role === "CUSTOMER";

  return (
    <div className="flex space-x-2 items-center justify-center">
      {/* Preview Button */}
      {onPreview && (
        <Button variant="ghost" onClick={onPreview}>
          <FaEye />
        </Button>
      )}

      {/* Edit Button */}
      {onEdit &&
      // User or Admin -> customers and users pages, no status check needed
      (((isUser || isAdmin) && (isCustomerPage || isUserPage)) ||
        // For invoices page -> Only User or Admin can see edit button when status is UNPAID
        ((isUser || isAdmin) && isInvoicePage && status === "UNPAID") ||
        // For payments page -> All roles can see the edit button when status is UNPAID
        ((isUser || isAdmin || isCustomer) &&
          isPaymentPage &&
          status === "UNPAID")) ? (
        <Button variant="ghost" onClick={onEdit}>
          <FaEdit />
        </Button>
      ) : (
        <div className="h-8 w-11"></div>
      )}

      {/* Delete Button */}
      {onDelete &&
      ((isUser &&
        (isCustomerPage || isInvoicePage || isPaymentPage || isUserPage)) ||
        isAdmin) ? (
        <AlertDialog
          open={deletingId === id}
          onOpenChange={(open) => {
            if (!open) setDeletingId && setDeletingId(null);
          }}
        >
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="h-8 w-8 p-0"
              onClick={() => setDeletingId && setDeletingId(id)}
            >
              <MdDelete className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-xs sm:max-w-md mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={onDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <div className="h-8 w-11"></div>
      )}
    </div>
  );
};

export default Actions;
