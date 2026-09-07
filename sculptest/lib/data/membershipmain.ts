const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sculpt-backend-6flc.onrender.com";


export interface Membership {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  period: string;
  classLimit: number | null;
  duration: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
  displayOrder: number;
  autoRenew: boolean;
  isActive: boolean;
}

interface GetMembershipsResponse {
  success: boolean;
  message: string;
  data: Membership[];
}

export async function getMemberships(): Promise<Membership[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/memberships`);
  } catch {
    throw new Error(
      `Membership API is unreachable. Check your internet connection, Render service status, and CORS allowlist for ${process.env.NEXT_PUBLIC_API_URL || "https://sculpt-lab-booking-flow-1.v0.build"}.`,
    );
  }

  const body = await response.text();

  let result: GetMembershipsResponse;
  try {
    result = JSON.parse(body) as GetMembershipsResponse;
  } catch {
    throw new Error(
      `Membership API returned ${response.status} ${response.statusText} instead of JSON. Check the backend URL and CORS configuration.`,
    );
  }

  if (!response.ok) {
    throw new Error(result.message || "Failed to load memberships");
  }

  return result.data;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}
