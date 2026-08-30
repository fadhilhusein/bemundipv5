import { DataForm } from "@/components/dashboard/DataForm";
import { TABLES } from "@/lib/data/tables";

export default function AgendaPage() {
  return <DataForm config={TABLES["agenda"]} canManage />;
}
