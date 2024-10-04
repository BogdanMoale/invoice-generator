import { FieldErrors } from "react-hook-form";
import { FormError } from "./form-error";

interface FormErrorsProps {
  errors: FieldErrors;
}

export const FormErrors: React.FC<FormErrorsProps> = ({ errors }) => {
  return (
    Object.keys(errors).length > 0 && (
      <div className="text-red-500 space-y-2">
        <ul>
          {Object.entries(errors).map(([key, error]) => (
            <li key={key}>
              <FormError message={(error as any).message} />
            </li>
          ))}
        </ul>
      </div>
    )
  );
};
