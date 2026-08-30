import { DataForm } from "@/components/dashboard/DataForm";
import { TABLES } from "@/lib/data/tables";

export default function ProgramUnggulanPage() {
  return <DataForm config={TABLES["program-unggulan"]} canManage />;
}
