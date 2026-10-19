-- Run this if nominal column exist but is null and discount is set to 0
update public.orders_menus om
set nominal = m.price * om.quantity
from public.menus m
where om.menu_id = m.id
  and om.nominal is null;