import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface MobileCardProps {
  title: string;
  content: ReactNode;
  footer: ReactNode;
}

const MobileCard: React.FC<MobileCardProps> = ({ title, content, footer }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-center p-0">{content}</CardContent>
      <CardFooter className="flex justify-center space-x-2 mt-4">
        {footer}
      </CardFooter>
    </Card>
  );
};

export default MobileCard;
