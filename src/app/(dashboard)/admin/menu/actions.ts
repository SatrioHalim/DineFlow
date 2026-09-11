"use server";

import { uploadFile } from "@/actions/storage-action";
import {
  INITIAL_MENU,
  INITIAL_STATE_MENU,
} from "@/constants/menu-constant";
import { createClient } from "@/lib/supabase/server";
import { MenuFormState } from "@/types/menu";
import { menuSchema } from "@/validations/menu-validation";

export async function createMenu(
  prevState: MenuFormState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_MENU;
  }

  let validateFields = menuSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: parseFloat(formData.get("price") as string),
    discount: parseFloat(formData.get("discount") as string),
    category: formData.get("category"),
    image_url: formData.get("image_url"),
    is_available: formData.get("is_available") === "true" ? true : false,
  });

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  if (validateFields.data.image_url instanceof File) {
    const { errors, data } = await uploadFile(
      "images",
      "menus",
      validateFields.data.image_url,
    );

    if (errors) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [...errors._form],
        },
      };
    }

    validateFields = {
      ...validateFields,
      data: {
        ...validateFields.data,
        image_url: data.url,
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("menus").insert({
    name: validateFields.data.name,
    description: validateFields.data.description,
    price: validateFields.data.price,
    discount: validateFields.data.discount,
    category: validateFields.data.category,
    image_url: validateFields.data.image_url,
    is_available: validateFields.data.is_available,
  });

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }
  return {
    status: "success",
  };
}
