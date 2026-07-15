import { DataForm } from "@/components/dashboard/DataForm";
import { TABLES } from "@/lib/data/tables";

export default function MasterKabinetPage() {
  return <DataForm config={TABLES["master-kabinet"]} />;
}
