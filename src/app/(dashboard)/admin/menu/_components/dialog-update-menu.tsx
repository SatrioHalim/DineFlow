import { zodResolver } from "@hookform/resolvers/zod";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { updateMenu } from "../actions";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import { Dialog } from "@/components/ui/dialog";
import { Menu, MenuForm, menuFormSchema } from "@/validations/menu-validation";
import { INITIAL_STATE_MENU } from "@/constants/menu-constant";
import FormMenu from "./form-menu";

type DialogUpdateMenuProps = {
  refetch: () => void;
  currentData?: Menu;
  handleChangeAction?: (open: boolean) => void;
  open?: boolean;
};

export default function DialogUpdateMenu({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: DialogUpdateMenuProps) {
  const form = useForm<MenuForm>({
    resolver: zodResolver(menuFormSchema),
  });

  const [updateMenuState, updateMenuAction, isPendingupdateMenu] =
    useActionState(updateMenu, INITIAL_STATE_MENU);
  const lastHandledStatusRef = useRef<string | undefined>(undefined);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    lastHandledStatusRef.current = undefined;
    const formData = new FormData();
    if (currentData?.image_url !== data?.image_url) {
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image_url") {
          if (preview?.file) {
            formData.append(key, preview.file);
          }
          return;
        }

        formData.append(key, String(value ?? ""));
      });
      formData.append("old_image_url", currentData?.image_url ?? "");
    } else {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    formData.append("id", currentData?.id ?? "");

    startTransition(() => {
      updateMenuAction(formData);
    });
  });

  useEffect(() => {
    if (
      updateMenuState?.status === "error" &&
      lastHandledStatusRef.current !== "error"
    ) {
      toast.error("Update menu failed", {
        description: updateMenuState.errors?._form?.[0],
      });
      lastHandledStatusRef.current = "error";
    }
    if (
      updateMenuState?.status === "success" &&
      lastHandledStatusRef.current !== "success"
    ) {
      toast.success("Update menu success");
      form.reset();
      refetch();
      lastHandledStatusRef.current = "success";
      handleChangeAction?.(false);
    }
  }, [updateMenuState, updateMenuAction, form, refetch]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name);
      form.setValue("description", currentData.description);
      form.setValue("category", currentData.category);
      form.setValue("price", currentData.price.toString());
      form.setValue("discount", currentData.discount.toString());
      form.setValue("is_available", currentData.is_available.toString());
      form.setValue("image_url", currentData.image_url);
      setPreview({
        file: new File([], currentData.image_url as string),
        displayUrl: currentData.image_url as string,
      });
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormMenu
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingupdateMenu}
        type="Update"
        preview={preview}
        setPreview={setPreview}
      ></FormMenu>
    </Dialog>
  );
}
