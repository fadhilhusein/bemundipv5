import { DataForm } from "@/components/dashboard/DataForm";
import { TABLES } from "@/lib/data/tables";

export default function PublikasiPage() {
  return <DataForm config={TABLES["publikasi"]} canManage />;
}
