export type FormState = {
  errors?: {
    _form?: string[];
  };
  status?: string;
};

export type Preview = { file: File; displayUrl: string };
