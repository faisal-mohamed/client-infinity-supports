"use client";

import React from "react";
import FairWorkInformationView from "./View";

interface FairWorkInformationEditProps {
  token: string;
  staff?: { firstName: string; surname: string };
  onSubmitted?: () => void;
}

export interface FairWorkInformationEditRef {
  save: () => Promise<void>;
}

const FairWorkInformationEdit = React.forwardRef<FairWorkInformationEditRef, FairWorkInformationEditProps>(
  ({ token, staff, onSubmitted }, ref) => {
    // This is a read-only form, so we just use the View component
    // The actual save/submit logic is handled by the page component
    return <FairWorkInformationView />;
  }
);

FairWorkInformationEdit.displayName = 'FairWorkInformationEdit';

export default FairWorkInformationEdit;
