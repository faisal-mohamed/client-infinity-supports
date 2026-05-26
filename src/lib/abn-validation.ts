/**
 * ABN (Australian Business Number) Validation
 * - Format: 11 digits
 * - Checksum: Weighted modulus 89 algorithm (official ATO method)
 * - Optional: ABR API lookup for business name verification
 */

const ABN_WEIGHTS = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

/**
 * Validates ABN format and checksum.
 * Returns { valid: boolean, error?: string }
 */
export function validateABNFormat(abn: string): { valid: boolean; error?: string } {
  const cleaned = abn.replace(/\s/g, '');

  if (!/^\d{11}$/.test(cleaned)) {
    return { valid: false, error: 'ABN must be exactly 11 digits' };
  }

  // ATO checksum algorithm
  const digits = cleaned.split('').map(Number);
  digits[0] -= 1; // Subtract 1 from first digit

  const sum = digits.reduce((acc, digit, i) => acc + digit * ABN_WEIGHTS[i], 0);

  if (sum % 89 !== 0) {
    return { valid: false, error: 'Invalid ABN checksum — please verify the number' };
  }

  return { valid: true };
}

/**
 * Lookup ABN via Australian Business Register API.
 * Returns business name if found, null if not found or API unavailable.
 * Non-blocking — registration proceeds even if lookup fails.
 */
export async function lookupABN(abn: string): Promise<{
  name?: string;
  status?: string;
  type?: string;
  state?: string;
} | null> {
  const cleaned = abn.replace(/\s/g, '');
  const guid = process.env.ABR_API_GUID; // Optional: ABR API key

  if (!guid) return null; // ABR lookup disabled if no API key

  try {
    const url = `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${cleaned}&callback=callback&guid=${guid}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    const text = await res.text();
    // ABR returns JSONP: callback({...})
    const jsonStr = text.replace(/^callback\(/, '').replace(/\)$/, '');
    const data = JSON.parse(jsonStr);

    if (data.Abn) {
      return {
        name: data.EntityName || data.BusinessName?.[0]?.Name,
        status: data.AbnStatus,
        type: data.EntityTypeName,
        state: data.AddressState,
      };
    }

    return null;
  } catch {
    return null; // Non-critical — don't block registration
  }
}
