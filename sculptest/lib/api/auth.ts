const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sculpt-backend-6flc.onrender.com";

export type AuthUser = {
  id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  provider?: string;
  role?: string;
  isEmailVerified?: boolean;
};

type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  user?: AuthUser;
};

export class ApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getMessage(
  body: ApiResponse,
  status: number
) {
  if (typeof body.message === "string") {
    return body.message;
  }

  return status === 401
    ? "Your session has expired."
    : "Unable to complete this request.";
}

let refreshPromise: Promise<boolean> | null =
  null;

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = fetch(
      `${BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    )
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<ApiResponse<T>> {
  let response: Response;

  try {
    response = await fetch(
      `${BASE_URL}${path}`,
      {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type":
            "application/json",
          ...(options.headers || {}),
        },
      }
    );
  } catch {
    throw new ApiError(
      "We could not reach Sculpt LAB. Please check your connection and try again.",
      0
    );
  }

  if (
    response.status === 401 &&
    retry &&
    path !== "/api/auth/refresh"
  ) {
    if (await refreshSession()) {
      return request<T>(
        path,
        options,
        false
      );
    }
  }

  const text =
    await response.text();

  let body: ApiResponse<T> = {};

  try {
    body = text
      ? JSON.parse(text)
      : {};
  } catch {
    throw new ApiError(
      "The account service returned an unexpected response.",
      response.status
    );
  }

  if (!response.ok) {
    throw new ApiError(
      getMessage(
        body,
        response.status
      ),
      response.status
    );
  }

  return body;
}

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  bookingReference?: string;
};

export const authApi = {
register: (payload: RegisterPayload) => {
  console.log("🔥 REGISTER PAYLOAD INSIDE AUTH API:", payload)

  const body = {
    fullName: payload.fullName,
    email: payload.email,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
    phone: payload.phone,
    bookingReference: payload.bookingReference,
  }

  console.log("🔥 FINAL BODY SENT TO BACKEND:", body)

  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })
},

  login: (
    payload: {
      email: string;
      password: string;
    }
  ) =>
    request(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(
          payload
        ),
      }
    ),

  me: () =>
    request<AuthUser>(
      "/api/auth/me"
    ),

  refresh: () =>
    refreshSession(),

  logout: () =>
    request(
      "/api/auth/logout",
      {
        method: "POST",
      },
      false
    ),

  forgotPassword: (
    email: string
  ) =>
    request(
      "/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      }
    ),

  resetPassword: (
    payload: {
      token: string;
      password: string;
      confirmPassword: string;
    }
  ) =>
    request(
      "/api/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify(
          payload
        ),
      },
      false
    ),

  verifyEmail: (
    token: string
  ) =>
    request(
      `/api/auth/verify-email?token=${encodeURIComponent(
        token
      )}`,
      {},
      false
    ),
};

export const API_BASE_URL =
  BASE_URL;

export function getUser(
  response: ApiResponse
) {
  return (
    response.user ||
    (
      response.data as
        | { user?: AuthUser }
        | undefined
    )?.user ||
    (response.data as AuthUser | undefined)
  );
}