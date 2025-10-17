"use client";

import React from "react";
import ClientIntakeFormUnified from "./ClientIntakeFormUnified";

/**
 * Wrapper component for interactive/edit mode
 * This is used in the form registry for editing forms
 */
const ClientIntakeFormEdit: React.FC<any> = (props) => {
  return <ClientIntakeFormUnified {...props} mode="interactive" />;
};

export default ClientIntakeFormEdit;

