// API functions should receive user and token as arguments
export async function getUserAttendance(userId: string, token: string) {
  const attendanceRes = await fetch(`http://localhost:5050/api/attendance/${userId}`, {
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
  return attendanceData;
}

export async function getAllUserAttendance(token: string) {
  const localToken = localStorage.getItem('adminAuthToken');
  const attendanceRes = await fetch(`http://localhost:5050/api/attendance`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!attendanceRes.ok) {
    throw new Error("Failed to fetch attendance data");
  }

  const attendanceData = await attendanceRes.json();
  return attendanceData;
}

export async function checkInAttendance(userId: string, token: string) {
  const checkInData = {
    user_id: userId
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
      alert(responseBody.error); // Show error alert
    } else {
      alert("Check-in successful!"); // Show success alert
    }

  } catch (err) {
    console.error("Error during check-in:", err);
  }
}

export async function checkOutAttendance(userId: string, token: string) {
  const checkInData = {
    user_id: userId
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
      alert(responseBody.error); // Show error alert
    } else {
      alert("Check-out successful!"); // Show success alert
    }

  } catch (err) {
    console.error("Error during check-out:", err);
  }
}
