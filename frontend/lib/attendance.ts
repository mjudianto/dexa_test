export async function getUserAttendance() {
  const storedUserData = JSON.parse(localStorage.getItem("userData") || '{}');
  
  if (storedUserData) {
    localStorage.setItem("userData", JSON.stringify(storedUserData));
  }

  const token = localStorage.getItem("authToken");

  const attendanceRes = await fetch(`http://localhost:5050/api/attendance/${storedUserData.id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!attendanceRes.ok) {
    throw new Error("Failed to fetch attendance data");
  }

  const attendanceData = await attendanceRes.json();
  localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
}

export async function checkInAttendance() {
  const storedUserData = JSON.parse(localStorage.getItem("userData") || '{}');
  
  if (!storedUserData || !storedUserData.id) {
    throw new Error("User data is missing or invalid");
  }

  const token = localStorage.getItem("authToken");

  // Prepare the request body
  const checkInData = {
    user_id: storedUserData.id
  };

  try {
    const attendanceRes = await fetch(`http://localhost:5050/api/attendance`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(checkInData),
    });

    if (!attendanceRes.ok) {
      const responseBody = await attendanceRes.json();
      alert(responseBody.message); // Show success alert
    }
    else {
      alert("Check-in successful!"); // Show success alert
    }

  } catch (err) {
    console.error("Error during check-in:", err);
  }
}

export async function checkOutAttendance() {
  const storedUserData = JSON.parse(localStorage.getItem("userData") || '{}');
  
  if (!storedUserData || !storedUserData.id) {
    throw new Error("User data is missing or invalid");
  }

  const token = localStorage.getItem("authToken");

  // Prepare the request body
  const checkInData = {
    user_id: storedUserData.id
  };

  try {
    const attendanceRes = await fetch(`http://localhost:5050/api/attendance/checkout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(checkInData),
    });

    if (!attendanceRes.ok) {
      const responseBody = await attendanceRes.json();
      alert(responseBody.message); // Show success alert
    }
    else {
      alert("Check-out successful!"); // Show success alert
    }

  } catch (err) {
    console.error("Error during check-in:", err);
  }
}

