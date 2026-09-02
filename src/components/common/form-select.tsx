import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

export default function FormSelect<T extends FieldValues>({
  form,
  name,
  label,
  selectItem,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  selectItem: { value: string; label: string; disabled?: boolean }[];
}) {
  const inputId = `form-${name}`;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, ...rest }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
          <Select {...rest} onValueChange={onChange}>
            <SelectTrigger
              className={cn("w-full", {
                "border-red-500": form.formState.errors[name]?.message,
              })}
            >
              <SelectValue placeholder={`Select ${label}`}></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {selectItem.map((item) => (
                  <SelectItem
                    key={item.label}
                    value={item.value}
                    disabled={item.disabled}
                    className={"capitalize"}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
