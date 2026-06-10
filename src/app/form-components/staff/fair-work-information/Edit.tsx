"use client";

import React from "react";
import FairWorkInformationView from "./View";

interface FairWorkInformationEditProps {
  data?: any;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FairWorkInformationEditRef {}

const FairWorkInformationEdit = React.forwardRef<
  FairWorkInformationEditRef,
  FairWorkInformationEditProps
>(function FairWorkInformationEdit(_props, _ref) {
  return (
    <FairWorkInformationView acknowledgementMode="editable" />
  );
});

FairWorkInformationEdit.displayName = "FairWorkInformationEdit";

export default FairWorkInformationEdit;


