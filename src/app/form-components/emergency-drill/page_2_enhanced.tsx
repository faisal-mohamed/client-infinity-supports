import React from 'react';
import ContentAwarePagination from './components/ContentAwarePagination';

const Page2Enhanced: React.FC<any> = ({ schema, data, commonFieldsData, settings }) => {
  return (
    <ContentAwarePagination 
      schema={schema}
      data={data}
      commonFieldsData={commonFieldsData}
      settings={settings}
    />
  );
};

export default Page2Enhanced;
