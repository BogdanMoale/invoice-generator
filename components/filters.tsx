import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";

interface FilterInputsProps {
  filters: Array<{
    id: string;
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  }>;
  columns: ColumnDef<any>[];
  table: any;
}

const FilterInputs: React.FC<FilterInputsProps> = ({
  filters,
  columns,
  table,
}) => {
  return (
    <div className="flex items-center py-4">
      {filters.map((filter) => (
        <Input
          key={filter.id}
          id={filter.id}
          name={filter.name}
          placeholder={filter.placeholder}
          value={filter.value}
          onChange={filter.onChange}
          className="max-w-sm"
          autoComplete="off"
        />
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-auto hidden sm:inline-flex items-center"
          >
            Columns <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column: any) => column.getCanHide())
            .map((column: any) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterInputs;
