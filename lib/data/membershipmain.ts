import { API_BASE_URL } from "../api/booking";

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
  const response = await fetch(`${API_BASE_URL}/api/memberships`);

  const result: GetMembershipsResponse = await response.json();

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