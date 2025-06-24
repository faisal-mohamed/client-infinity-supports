import BatchSignaturePage from "./BatchSignaturePage";

export default async function BatchSignatureEntry({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const awaitedParams = await params;
  return <BatchSignaturePage batchToken={awaitedParams.token} />;
}
