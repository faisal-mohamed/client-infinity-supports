"use client";

import React from "react";
import CasualEmploymentInformationView from "./View";

interface CasualEmploymentInformationEditProps {
  token: string;
  staff?: { firstName: string; surname: string };
  onSubmitted?: () => void;
}

export interface CasualEmploymentInformationEditRef {
  save: () => Promise<void>;
}

const CasualEmploymentInformationEdit = React.forwardRef<CasualEmploymentInformationEditRef, CasualEmploymentInformationEditProps>(
  ({ token, staff, onSubmitted }, ref) => {
    // This is a read-only form, so we just use the View component
    // The actual save/submit logic is handled by the page component
    return <CasualEmploymentInformationView />;
  }
);

CasualEmploymentInformationEdit.displayName = 'CasualEmploymentInformationEdit';

export default CasualEmploymentInformationEdit;
