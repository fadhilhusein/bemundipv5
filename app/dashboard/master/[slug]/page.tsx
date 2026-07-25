import { notFound } from "next/navigation";
import { DataForm } from "@/components/dashboard/DataForm";
import { TABLES } from "@/lib/data/tables";

export default async function MasterTablePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = TABLES[slug];
  if (!config) notFound();

  return <DataForm config={config} canManage />;
}
