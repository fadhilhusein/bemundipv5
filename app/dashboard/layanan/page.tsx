import { DataForm } from "@/components/dashboard/DataForm";
import { TABLES } from "@/lib/data/tables";

export default function LayananPage() {
  return <DataForm config={TABLES["layanan"]} />;
}
