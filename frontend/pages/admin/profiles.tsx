import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAllUser } from "@/lib/user";
import { User } from "../../types/User";
import { useAuthContext } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, token, updateUser: updateUserContext } = useAuthContext();

  const [activeTab, setActiveTab] = useState<"info" | "password">("info");
  const [allUserData, setAllUser] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      await getAllUser();

      const usersJsonString = localStorage.getItem("allUserData");
      const usersArray = JSON.parse(usersJsonString || '[]');

      setAllUser(usersArray);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Could not load user data.");
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser(prev => ({ ...prev!, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setEditingUser(prev => prev ? ({ ...prev, profile_file: file }) : prev);
    }
  };

  const handleSaveChanges = async () => {
    if (!editingUser || !token) return;

    setLoading(true);
    const form = new FormData();
    form.append("name", editingUser.name);
    form.append("phone_number", editingUser.phone_number || "");
    if ((editingUser as any).profile_file) {
      form.append("profile_file", (editingUser as any).profile_file);
    }

    const localToken = localStorage.getItem("adminAuthToken");

    try {
      const res = await fetch(
        `http://localhost:5050/api/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${localToken}` },
          body: form,
        }
      );
      if (!res.ok) throw new Error((await res.json()).message);
      
      await fetchUsers();
      alert("Profile updated successfully!");
      setEditingUser(null);
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!loggedInAdmin || !token) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch(`http://localhost:5050/api/users/${loggedInAdmin.id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) throw new Error((await res.json()).message);

      alert("Password updated successfully.");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      alert(`Failed to update password: ${err.message}`);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleHomeClick = () => router.push("/admin/home");

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    if (user.profile_picture) {
      setPreview(`http://localhost:5050/uploads/${user.profile_picture}`);
    } else {
      setPreview(null);
    }
    setActiveTab("info");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="relative bg-gradient-to-r from-[#b0241b] via-[#f24d3c] to-[#bf1e1e] px-6 py-4 flex items-center shadow">
        <div className="hidden sm:flex items-center gap-3">
          <Image
            src="/logo dexa.jpg"
            alt="Dexa Logo"
            width={100}
            height={40}
            className="object-contain"
            onClick={handleHomeClick}
          />
        </div>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <span className="text-white font-semibold text-xl tracking-wide text-center">Profile</span>
        </div>
        <button
          onClick={handleHomeClick}
          className="absolute right-6 border border-white text-white font-semibold text-l px-4 py-2 rounded-full hover:bg-white hover:text-black transition"
        >Back To Home</button>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
          <div className="overflow-x-auto w-full max-w-full">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-2 cursor-pointer hover:text-blue-600">User Name</th>
                  <th className="px-4 py-2 cursor-pointer hover:text-blue-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {allUserData.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2 font-medium text-gray-900">{user?.name}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          {activeTab === "info" && editingUser && (
            <>
              <h3 className="text-lg font-bold mb-6">Edit User Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      name="name"
                      value={editingUser?.name}
                      onChange={handleProfileChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      name="phone_number"
                      value={editingUser?.phone_number ?? ""}
                      onChange={handleProfileChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                      name="email"
                      value={editingUser?.email}
                      readOnly
                      className="w-full bg-gray-100 border rounded px-3 py-2 text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Profile Photo</label>
                    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-6 text-gray-500 cursor-pointer">
                      <input
                        type="file"
                        name="profile"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full bg-gray-100 border rounded px-3 py-2 text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={handleSaveChanges}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}

          {activeTab === "password" && (
            <>
              <h3 className="text-lg font-bold mb-6">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      />                
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-6 text-right">
                <button 
                  onClick={handleUpdatePassword}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}