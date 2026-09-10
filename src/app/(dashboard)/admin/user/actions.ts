"use server";

import { deleteFile, uploadFile } from "@/actions/storage-action";
import {
  INITIAL_STATE_CREATE_USER,
  INITIAL_STATE_UPDATE_USER,
} from "@/constants/auth-constant";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import {
  createUserSchema,
  updateUserSchema,
} from "@/validations/auth-validation";

export async function createUser(
  prevState: AuthFormState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_CREATE_USER;
  }

  let validateFields = createUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    role: formData.get("role"),
    avatar_url: formData.get("avatar_url"),
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

  if (validateFields.data.avatar_url instanceof File) {
    const { errors, data } = await uploadFile(
      "images",
      "users",
      validateFields.data.avatar_url,
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
        avatar_url: data.url,
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: validateFields.data.email,
    password: validateFields.data.password,
    options: {
      data: {
        name: validateFields.data.name,
        role: validateFields.data.role,
        avatar_url: validateFields.data.avatar_url,
      },
    },
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

export async function updateUser(
  prevState: AuthFormState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_UPDATE_USER;
  }

  let validateFields = updateUserSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    avatar_url: formData.get("avatar_url"),
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

  if (validateFields.data.avatar_url instanceof File) {
    const oldAvatarUrl = formData.get("old_avatar_url") as string;
    const { errors, data } = await uploadFile(
      "images",
      "users",
      validateFields.data.avatar_url,
      oldAvatarUrl.split("/images/")[1],
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
        avatar_url: data.url,
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      name: validateFields.data.name,
      role: validateFields.data.role,
      avatar_url: validateFields.data.avatar_url,
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

export async function deleteUser(prevState: AuthFormState, formData: FormData) {
  const supabase = await createClient({ isAdmin: true });
  const image = (formData.get("avatar_url") as string | null) ?? "";
  const userId = (formData.get("id") as string | null) ?? "";

  if (!userId) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["User id is required"],
      },
    };
  }

  if (image) {
    const filePath = image.includes("/images/")
      ? image.split("/images/")[1]
      : image;

    if (filePath) {
      const { status, errors } = await deleteFile("images", filePath);

      if (status === "error") {
        return {
          status: "error",
          errors: {
            ...prevState.errors,
            _form: [errors?._form?.[0] ?? "Unknown error"],
          },
        };
      }
    }
  }

  const { error } = await supabase.auth.admin.deleteUser(userId);

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
