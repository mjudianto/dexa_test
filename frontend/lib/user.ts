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

export async function getAllUser() {
  const localToken = localStorage.getItem("adminAuthToken");

  const userRes = await fetch(`http://localhost:5050/api/users`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!userRes.ok) {
    throw new Error("Failed to fetch all user data");
  }

  const userData = await userRes.json();
  localStorage.setItem("allUserData", JSON.stringify(userData));
}

// Function to update the user profile
export const updateUserProfile = async (userId: string, token: string, formData: FormData) => {
  const res = await fetch(`http://localhost:5050/api/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update profile");
  }

  return res.json(); // Returns the updated user data
};

// Function to update the user password
export const updateUserPassword = async (userId: string, token: string, currentPassword: string, newPassword: string) => {
  const res = await fetch(`http://localhost:5050/api/users/${userId}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update password");
  }

  return res.json(); // Returns a success message or empty response
};
