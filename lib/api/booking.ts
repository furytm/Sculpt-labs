export interface CreateBookingRequest {
  fullName: string;
  email: string;
  phone: string;
  membershipId: string;
}

export interface BookingData {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  membership: {
    id: string;
    name: string;
    priceNGN: number;
  };
  classSession: {
    classId: string;
    className: string;
    instructorId: string;
    instructorName: string;
    date: string;
    time: string;
    duration: number;
  };
  voucher?: {
    code: string;
    discount: number;
  };
  subtotal: number;
  discount: number;
  totalAmount: number;
  timestamp: string;
}

export interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  classId: string;
  scheduleId: string;
  bookingDate: string;
  amount: number;
  paymentReference: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingResponse {
  success: boolean;
  message?: string;
  data: {
    booking: Booking;
    authorizationUrl: string;
  };
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sculpt-backend-6flc.onrender.com";

export async function createBooking(
  data: CreateBookingRequest
): Promise<CreateBookingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await response.text();
  let result: CreateBookingResponse;
  try {
    result = JSON.parse(body) as CreateBookingResponse;
  } catch {
    throw new Error(
      `Booking API returned ${response.status} ${response.statusText} instead of JSON. Check the backend URL and CORS configuration.`,
    );
  }

  if (!response.ok) {
    throw new Error(result.message || "Failed to create booking");
  }

  return result;
}
