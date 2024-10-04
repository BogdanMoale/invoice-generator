// components/Notification.tsx

import { toast } from "sonner";
import { IoMdClose } from "react-icons/io";

const greenColor = "#28a745";
const greenBackground = "#d4edda";
const redColor = "#dc3545";
const redBackground = "#f8d7da";

export const Notification = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description: description,
      style: {
        backgroundColor: greenBackground,
        color: greenColor,
        border: `1px solid ${greenColor}`,
      },
      action: {
        label: <IoMdClose />,
        onClick: () => toast.dismiss(),
      },
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description: description,
      style: {
        backgroundColor: redBackground,
        color: redColor,
        border: `1px solid ${redColor}`,
      },
      action: {
        label: <IoMdClose />,
        onClick: () => toast.dismiss(),
      },
    });
  },
};
