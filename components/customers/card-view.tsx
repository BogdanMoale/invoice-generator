import MobileCard from "../ui/mobile-card";
import Actions from "../form/form-actions";
import { Customer } from "@/types";

interface CustomersCardViewProps {
  filteredData: Customer[];
  currentUser: { role: string } | undefined;
  handleEditCustomer: (customer: Customer) => void;
  onCustomerDeletedHandler: () => void;
  deletingCustomerId: string | null;
  setDeletingCustomerId: (id: string | null) => void;
}

const CustomersCardView: React.FC<CustomersCardViewProps> = ({
  filteredData,
  currentUser,
  handleEditCustomer,
  onCustomerDeletedHandler,
  deletingCustomerId,
  setDeletingCustomerId,
}) => {
  return (
    <div className="sm:hidden grid gap-4">
      {filteredData.map((customer) => (
        <MobileCard
          key={customer.id}
          title={customer.name}
          content={
            <>
              <div>
                <strong>Email:</strong> {customer.email}
              </div>
              {customer.phone && (
                <div>
                  <strong>Phone:</strong> {customer.phone}
                </div>
              )}
              {customer.companyName && (
                <div>
                  <strong>Company Name:</strong> {customer.companyName}
                </div>
              )}
              {customer.address && (
                <div>
                  <strong>Address:</strong> {customer.address}
                </div>
              )}
              {currentUser?.role === "ADMIN" && (
                <div>
                  <strong>Associated User:</strong>{" "}
                  {customer.users?.[0]?.user?.name ?? "N/A"}
                </div>
              )}
            </>
          }
          footer={
            <Actions
              id={customer.id}
              onEdit={() => handleEditCustomer(customer)}
              onDelete={() => onCustomerDeletedHandler()}
              deletingId={deletingCustomerId}
              setDeletingId={setDeletingCustomerId}
              currentUser={currentUser}
            />
          }
        />
      ))}
    </div>
  );
};

export default CustomersCardView;
