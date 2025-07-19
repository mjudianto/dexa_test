import { jwtDecode } from "jwt-decode";

// Function to check if the token is expired
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true; // If no token, consider it expired

  try {
    // Decode the token
    const decoded: any = jwtDecode(token);

    // Extract the expiration time (exp) from the token
    const currentTime = Date.now() / 1000; // Get current time in seconds
    if (decoded.exp < currentTime) {
      return true; // Token has expired
    }

    return false; // Token is still valid
  } catch (err) {
    console.error("Error decoding token:", err);
    return true; // If the token is invalid or cannot be decoded, consider it expired
  }
}

export async function loginUser(email: string, password: string) {
  const res = await fetch("http://localhost:5050/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed");
  }

  const data = await res.json();

  // Fetch user details using the user ID
  const userRes = await fetch(`http://localhost:5050/api/users/${data.userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${data.token}`,
      "Content-Type": "application/json"
    }
  });

  if (!userRes.ok) {
    throw new Error("Failed to fetch user data");
  }

  const user = await userRes.json();

  return { token: data.token, user }; // Return token and user
}

export async function loginAdminApi(email: string, password: string) {
  const res = await fetch("http://localhost:5050/api/auth/loginAdmin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed");
  }

  const data = await res.json();

  // Fetch user details using the user ID
  const userRes = await fetch(`http://localhost:5050/api/users/${data.userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${data.token}`,
      "Content-Type": "application/json"
    }
  });

  if (!userRes.ok) {
    throw new Error("Failed to fetch user data");
  }

  const user = await userRes.json();

  return { token: data.token, user }; // Return token and user
}

