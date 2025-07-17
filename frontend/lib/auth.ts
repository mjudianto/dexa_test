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
