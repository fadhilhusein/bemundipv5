import { DataForm } from "@/components/dashboard/DataForm";
import { TABLES } from "@/lib/data/tables";

export default function MediaSosialPage() {
  return <DataForm config={TABLES["media-sosial"]} />;
}
