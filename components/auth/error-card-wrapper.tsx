import { Card, CardFooter, CardHeader } from "../ui/card";
import { BackButton } from "@/components/auth/back-button";
import { Header } from "@/components/auth/header";

const ErrorCard = () => {
  return (
    <Card className=" w-full max-w-[400px]">
      <CardHeader>
        <Header
          title="Error❗"
          label="Oops! Something Went Wrong! Please try again!"
        />
      </CardHeader>
      <CardFooter>
        <BackButton href="/auth/login" label="Back to login" />
      </CardFooter>
    </Card>
  );
};
export default ErrorCard;
