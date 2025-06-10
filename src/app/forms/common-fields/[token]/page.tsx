import CommonFieldsFormClient from './CommonFieldsFormClient';

export default async function CommonFieldsFormPage({ params }: { params: Promise<{ token: string }> }) {

  const {token} = await params

  return <CommonFieldsFormClient token={token} />;
}
