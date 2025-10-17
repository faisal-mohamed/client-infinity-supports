"use client";

import React from "react";
import ClientIntakeFormUnified from "./ClientIntakeFormUnified";

/**
 * Wrapper component for PDF/view mode
 * This is used in the form registry for viewing/downloading forms
 */
const ClientIntakeFormView: React.FC<any> = (props) => {
  return <ClientIntakeFormUnified {...props} mode="pdf" />;
};

export default ClientIntakeFormView;

