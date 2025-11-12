import React from 'react';
import SASupportCoordinationDynamic from '../../components/forms/sa-support-coordination/SASupportCoordinationDynamic';

const SASupportCoordination = ({ formKey, formData, settings, commonFieldsData }: any) => {
  return (
    <div className="bg-gray-100 min-h-screen print:bg-white print:py-0">
      <div className="w-[900px] mx-auto py-8 print:py-0">
        <SASupportCoordinationDynamic
          formData={formData}
          commonFieldsData={commonFieldsData}
          settings={settings}
          isReadOnly={true}
        />
      </div>
    </div>
  );
};

export default SASupportCoordination;
