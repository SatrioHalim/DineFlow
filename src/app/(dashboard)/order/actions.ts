"use server";

import { INITIAL_STATE_TABLE } from "@/constants/table-constant";
import { createClient } from "@/lib/supabase/server";
import { FormState } from "@/types/general";
import { Cart, OrderFormState } from "@/types/order";
import { orderFormSchema } from "@/validations/order-validation";
import { redirect } from "next/navigation";

export async function createOrder(
  prevState: OrderFormState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_TABLE;
  }

  const validateFields = orderFormSchema.safeParse({
    customer_name: formData.get("customer_name"),
    table_id: formData.get("table_id"),
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

  const orderId = `DF-${Date.now()}`;

  const [orderResult, tableResult] = await Promise.all([
    supabase.from("orders").insert({
      order_id: orderId,
      customer_name: validateFields.data.customer_name,
      table_id: validateFields.data.table_id,
      status: validateFields.data.status,
    }),
    supabase
      .from("tables")
      .update({
        status:
          validateFields.data.status === "reserved"
            ? "reserved"
            : "unavailable",
      })
      .eq("id", validateFields.data.table_id),
  ]);

  const orderError = orderResult.error;
  const tableError = tableResult.error;

  if (orderError || tableError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [
          ...(orderError ? [orderError.message] : []),
          ...(tableError ? [tableError.message] : []),
        ],
      },
    };
  }
  return {
    status: "success",
  };
}

export async function updateReservation(
  prevState: FormState,
  formData: FormData | null,
) {
  const supabase = await createClient();

  const [orderResult, tableResult] = await Promise.all([
    supabase
      .from("orders")
      .update({
        status: formData?.get("status"),
      })
      .eq("id", formData?.get("id")),
    supabase
      .from("tables")
      .update({
        status:
          formData?.get("status") === "process" ? "unavailable" : "available",
      })
      .eq("id", formData?.get("table_id")),
  ]);

  const orderError = orderResult.error;
  const tableError = tableResult.error;

  if (orderError || tableError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [
          ...(orderError ? [orderError.message] : []),
          ...(tableError ? [tableError.message] : []),
        ],
      },
    };
  }
  return {
    status: "success",
  };
}

export async function addOrderItem(
  prevState: FormState,
  data: {
    order_id: string;
    items: Cart[];
  },
) {
  const supabase = await createClient();

  const payload = data.items.map(({ total, menu, ...item }) => item);

  const { error } = await supabase.from("orders_menus").insert(payload);

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  redirect(`/order/${data.order_id}`);
}
