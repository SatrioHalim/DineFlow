export const HEADER_TABLE_MENU = [
  "No",
  "Name",
  "Category",
  "Price",
  "Availability",
  "Action",
];

export const CATEGORY_LIST = [
  {
    value: "Beverage",
    label: "Beverage",
  },
  {
    value: "Main Course",
    label: "Main Course",
  },
  {
    value: "Dessert",
    label: "Dessert",
  },
  {
    value: "Appetizer",
    label: "Appetizer",
  },
];

export const AVAILABILITY_LIST = [
  {
    value: "true",
    label: "Available",
  },
  {
    value: "false",
    label: "Not Available",
  },
];

export const INITIAL_MENU = {
  name: "",
  description: "",
  price: "",
  discount: "",
  category: "",
  image_url: "",
  is_available: "",
};

export const INITIAL_STATE_MENU = {
  status: "idle",
  errors: {
    id: [],
    name: [],
    description: [],
    price: [],
    discount: [],
    category: [],
    image_url: [],
    is_available: [],
    _form: [],
  },
};
