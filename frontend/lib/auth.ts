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

  return res.json(); // typically contains user data or token
}
