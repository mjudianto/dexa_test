export async function getUser() {
  const storedUserData = JSON.parse(localStorage.getItem("userData") || '{}');
  
  if (storedUserData) {
    localStorage.setItem("userData", JSON.stringify(storedUserData));
  }

  const token = localStorage.getItem("authToken");

  const userRes = await fetch(`http://localhost:5050/api/users/${storedUserData.id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!userRes.ok) {
    throw new Error("Failed to fetch user data");
  }

  const userData = await userRes.json();
  localStorage.setItem("userData", JSON.stringify(userData));
}