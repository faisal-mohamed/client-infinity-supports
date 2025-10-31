"use client";

import React from "react";
import SupportActionPlanDynamic from "./SupportActionPlanDynamic";

const SupportActionPlanView: React.FC<any> = (props) => {
  try { console.log('[SAP View Wrapper] Using SupportActionPlanDynamic via SupportActionPlanView.tsx'); } catch {}
  return <SupportActionPlanDynamic {...props} />;
};

export default SupportActionPlanView;



