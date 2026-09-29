import DetailOrder from "./_components/detail-order";

export const metadata = {
  title: "DineFlow | Detail Order",
};

export default async function OrderManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DetailOrder id={id} />;
}
