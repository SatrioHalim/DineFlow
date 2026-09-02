import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FileImage } from "lucide-react";
import { getImageData } from "@/lib/utils";

export default function FormImage<T extends FieldValues>({
  form,
  name,
  label,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  preview?: {
    file: File;
    displayUrl: string;
  };
  setPreview?: (preview: { file: File; displayUrl: string }) => void;
}) {
  const inputId = `form-${name}`;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, ...rest }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
          <div className="flex items-center gap-2">
            <Avatar className={"h-9 w-9 rounded-lg"}>
              <AvatarImage
                src={preview?.displayUrl}
                alt={"preview"}
                className={"object-cover"}
              ></AvatarImage>
              <AvatarFallback className={"rounded-lg"}>
                <FileImage className="w-4 h-4"></FileImage>
              </AvatarFallback>
            </Avatar>
            <Input
              type="file"
              name={rest.name}
              ref={rest.ref}
              onBlur={rest.onBlur}
              disabled={rest.disabled}
              onChange={async (event) => {
                const selectedFile = event.target.files?.[0] ?? "";
                onChange(selectedFile);

                const { file, displayUrl } = getImageData(event);
                if (file) {
                  setPreview?.({
                    displayUrl,
                    file,
                  });
                }
              }}
            ></Input>
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
