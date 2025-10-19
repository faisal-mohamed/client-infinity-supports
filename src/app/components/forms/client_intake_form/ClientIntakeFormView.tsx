"use client";

import React from "react";
import ClientIntakeFormDynamic from "./ClientIntakeFormDynamic";

/**
 * Wrapper component for PDF/view mode
 * Now uses dynamic content flow instead of fixed 8 pages
 */
const ClientIntakeFormView: React.FC<any> = (props) => {
  return <ClientIntakeFormDynamic {...props} />;
};

export default ClientIntakeFormView;

