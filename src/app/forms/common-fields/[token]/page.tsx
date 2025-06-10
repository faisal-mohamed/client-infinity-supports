import CommonFieldsFormClient from './CommonFieldsFormClient';

export default function CommonFieldsFormPage({ params }: { params: { token: string } }) {
  return <CommonFieldsFormClient token={params.token} />;
}
