"use server";

import { INITIAL_STATE_TABLE } from "@/constants/table-constant";
import { createClient } from "@/lib/supabase/server";
import { TableFormState } from "@/types/table";
import { tableSchema } from "@/validations/table-validation";

export async function createTable(
  prevState: TableFormState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_TABLE;
  }

  const validateFields = tableSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: parseInt(formData.get("capacity") as string),
    status: formData.get("status"),
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

  const supabase = await createClient();
  const { error } = await supabase.from("tables").insert({
    name: validateFields.data.name,
    description: validateFields.data.description,
    capacity: validateFields.data.capacity,
    status: validateFields.data.status,
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

export async function updateTable(
  prevState: TableFormState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_TABLE;
  }

  const validateFields = tableSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: parseInt(formData.get("capacity") as string),
    status: formData.get("status"),
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

  const supabase = await createClient();

  const { error } = await supabase
    .from("tables")
    .update({
      name: validateFields.data.name,
      description: validateFields.data.description,
      capacity: validateFields.data.capacity,
      status: validateFields.data.status,
    })
    .eq("id", formData.get("id"));

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

export async function deleteTable(
  prevState: TableFormState,
  formData: FormData,
) {
  const supabase = await createClient();
  const tableId = (formData.get("id") as string | null) ?? "";

  if (!tableId) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["table id is required"],
      },
    };
  }

  const { error } = await supabase.from("tables").delete().eq("id", tableId);

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
