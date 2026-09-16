INSERT INTO public.menus (name, description, price, discount, image_url, category, is_available)
VALUES
  -- Appetizers
  ('Crispy Truffle Fries', 'Kentang goreng renyah dengan minyak truffle, parutan keju parmesan, dan saus garlic aioli', 38000, 0, '', 'Appetizer', true),
  ('Garlic Butter Wings', 'Sayap ayam goreng renyah dibalur saus mentega bawang gurih (6 pcs)', 45000, 0, '', 'Appetizer', true),

  -- Main Courses
  ('Dineflow Signature Burger', 'Double beef patty, keju cheddar meleleh, bacon jam, dan saus rahasia di dalam roti brioche', 75000, 0, '', 'Main Course', true),
  ('Classic Wagyu Ribeye Steak', 'Daging Wagyu Ribeye 200g dengan saus blackpepper, kentang tumbuk truffle, dan tumis sayuran', 185000, 0, '', 'Main Course', true),
  ('Creamy Carbonara Pasta', 'Spaghetti dengan saus krim otentik, daging asap, kuning telur, dan keju pecorino', 62000, 0, '', 'Main Course', true),
  ('Nasi Goreng Wagyu', 'Nasi goreng rempah khas Dineflow dengan potongan daging wagyu lembut dan telur mata sapi', 58000, 0, '', 'Main Course', false),

  -- Beverages
  ('Iced Caramel Macchiato', 'Espresso shot dari biji kopi arabika premium, susu segar, dan sirup karamel gurih', 35000, 0, '', 'Beverage', true),
  ('Matcha Oat Latte', 'Matcha grade seremonial Jepang dipadu dengan susu gandum segar', 38000, 0, '', 'Beverage', true),

  -- Desserts
  ('Classic Tiramisu', 'Kue tiramisu berlapis mascarpone gurih dan biskuit ladyfinger yang direndam espresso', 42000, 0, '', 'Dessert', true),
  ('Molten Lava Cake', 'Kue cokelat hangat dengan lelehan cokelat di tengahnya, disajikan dengan es krim vanila', 40000, 0, '', 'Dessert', true);