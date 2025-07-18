import { jwtDecode } from "jwt-decode";

export async function loginUser(email: string, password: string) {
  const res = await fetch("http://localhost:5050/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("authToken", data.token);  // Store token
  }

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

  const userData = await userRes.json();
  localStorage.setItem("userData", JSON.stringify(userData));

  return { token: data.token, userData };  // Return token and user data
}


export async function loginAdmin(email: string, password: string) {
  const res = await fetch("http://localhost:5050/api/auth/loginAdmin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("authTokenAdmin", data.token);  // Store token
  }

  // Fetch user details using the user ID
  const userRes = await fetch(`http://localhost:5050/api/users/${data.userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${data.token}`,
      "Content-Type": "application/json"
    }
  });

  if (!userRes.ok) {
    throw new Error("Failed to fetch admin data");
  }

  const userData = await userRes.json();
  localStorage.setItem("userData", JSON.stringify(userData));

  return { token: data.token, userData };  // Return token and user data
}


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


