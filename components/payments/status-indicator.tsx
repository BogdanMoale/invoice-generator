import React from "react";

type StatusProps = {
  status:
    | "Paid"
    | "Pending"
    | "Failed"
    | "Partially Paid"
    | "Unpaid"
    | "Completed"
    | "Proccesed";
};

const statusStyles = {
  Paid: {
    color: "text-green-500",
    dot: "bg-green-500",
  },
  Pending: {
    color: "text-orange-500",
    dot: "bg-orange-500",
  },
  Failed: {
    color: "text-red-500",
    dot: "bg-red-500",
  },
  "Partially Paid": {
    color: "text-yellow-500",
    dot: "bg-yellow-500",
  },
  Unpaid: {
    color: "text-gray-500",
    dot: "bg-gray-500",
  },
  Completed: {
    color: "text-green-500",
    dot: "bg-green-500",
  },
  Proccesed: {
    color: "text-green-500",
    dot: "bg-green-500",
  },
};

const StatusIndicator: React.FC<StatusProps> = ({ status }) => {
  const styles = statusStyles[status] || statusStyles.Pending;

  return (
    <div className="flex items-center space-x-2 p-3 rounded-lg">
      <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
      <span className={`font-medium ${styles.color}`}>{status}</span>
    </div>
  );
};

export default StatusIndicator;
