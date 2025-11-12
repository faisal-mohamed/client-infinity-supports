import React from 'react';
import SASupportCoordinationDynamic from '../../app/components/forms/sa-support-coordination/SASupportCoordinationDynamic';

const SASupportCoordinationView = ({ formData = {}, commonFieldsData, settings }: any) => {
  return (
    <div>
      <SASupportCoordinationDynamic 
        formData={formData} 
        commonFieldsData={commonFieldsData} 
        settings={settings}
        isReadOnly={true}
      />
    </div>
  );
};

export default SASupportCoordinationView;
