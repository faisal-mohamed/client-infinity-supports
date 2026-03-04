"use client";

import React from "react";
import SupportActionPlanDynamic from "./SupportActionPlanDynamic";

const SupportActionPlanView: React.FC<any> = (props) => {
  const commonFieldsData = props.commonFieldsData || props.commonFields || props.client?.commonFields || {};

  return (
    <div className="w-full h-full bg-white p-4">
      <SupportActionPlanDynamic
        formData={props.formData || {}}
        commonFieldsData={commonFieldsData}
        settings={props.settings}
        logoDataUrl={props.logoDataUrl}
      />
    </div>
  );
};

export default SupportActionPlanView;



