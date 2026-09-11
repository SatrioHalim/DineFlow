import { zodResolver } from "@hookform/resolvers/zod";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import { MenuForm, menuFormSchema } from "@/validations/menu-validation";
import { createMenu } from "../actions";
import { INITIAL_MENU, INITIAL_STATE_MENU } from "@/constants/menu-constant";
import FormMenu from "./form-menu";

type DialogCreateUserProps = {
  refetch: () => void;
  onSuccess?: () => void;
};

export default function DialogCreateMenu({
  refetch,
  onSuccess,
}: DialogCreateUserProps) {
  const form = useForm<MenuForm>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: INITIAL_MENU,
  });

  const [createMenuState, createMenuAction, isPendingcreateMenu] =
    useActionState(createMenu, INITIAL_STATE_MENU);
  const lastHandledStatusRef = useRef<string | undefined>(undefined);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    lastHandledStatusRef.current = undefined;
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "image_url") {
        if (preview?.file) {
          formData.append(key, preview.file);
        }
        return;
      }

      formData.append(key, String(value ?? ""));
    });

    startTransition(() => {
      createMenuAction(formData);
    });
  });

  useEffect(() => {
    if (
      createMenuState?.status === "error" &&
      lastHandledStatusRef.current !== "error"
    ) {
      toast.error("Create Menu Failed", {
        description: createMenuState.errors?._form?.[0],
      });
      lastHandledStatusRef.current = "error";
    }
    if (
      createMenuState?.status === "success" &&
      lastHandledStatusRef.current !== "success"
    ) {
      toast.success("Create Menu Success");
      form.reset();
      onSuccess?.();
      refetch();
      setPreview(undefined);
      lastHandledStatusRef.current = "success";
    }
  }, [createMenuState, createMenuAction, form, onSuccess, refetch]);

  return (
    <FormMenu
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingcreateMenu}
      type="Create"
      preview={preview}
      setPreview={setPreview}
    ></FormMenu>
  );
}
