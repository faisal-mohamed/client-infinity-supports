import FormPageClient from './FormPageClient';
import useRequireAuth from '../../hooks/useRequireAuth';

// export default function FormPage({ params }: { params: { id: string } }) {
//   return <FormPageClient params={params} />;
// }

export default function FormPage(props: { params: any }) {
  const { session, status } = useRequireAuth();
  if (status === 'loading' || !session) return null;
  return <FormPageClient params={props.params} />;
}
