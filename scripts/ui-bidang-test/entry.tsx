import React from "react";
import { createRoot } from "react-dom/client";
import { BidangManager } from "../../components/dashboard/BidangManager";

createRoot(document.getElementById("root")!).render(
  <BidangManager canManageAll={!location.search.includes("role=bidang")} />
);
