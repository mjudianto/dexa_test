import Image from "next/image";
import { useState, useEffect } from "react";
import { User } from '../types/User';
import { useRouter } from 'next/router';
import { getUser } from "@/lib/user";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"none" | "info" | "password">("info");
  const [userData, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (userData) {
      setUser((prevData) => ({
        ...prevData!,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = async () => {
    if (!userData) return;

    const token = localStorage.getItem("authToken");

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5050/api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      await getUser();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error during profile update:", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleHomeClick = () => {
    router.push("/");
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
        >
          Back To Home
        </button>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
          <div className="h-24 bg-gray-100 w-full" />
          <div className="flex justify-center -mt-12">
            {userData?.profile_picture ? (
              <Image
                src={userData?.profile_picture}
                alt={userData.name.charAt(0)}
                width={80}
                height={80}
                className="rounded-full border-4 border-white object-cover shadow"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow">
                {userData?.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-center px-6 py-4">
            <h2 className="text-lg font-semibold text-blue-600">{userData?.name}</h2>
            <p className="text-sm text-gray-700">{userData?.position.division}-{userData?.position.description}</p>
          </div>
          <div className="border-t divide-y">
            <div className="flex justify-between px-6 py-3 text-sm">
              <span className="text-gray-500">Email</span>
              <span className="text-blue-600 break-all">{userData?.email}</span>
            </div>
          </div>
          <div className="border-t divide-y">
            <div className="flex justify-between px-6 py-3 text-sm">
              <span className="text-gray-500">Phone</span>
              <span className="text-blue-600 break-all">{userData?.phone_number}</span>
            </div>
          </div>
          <div className="mt-4 px-6 pb-4 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("info")}
              className={`rounded-full px-4 py-2 text-sm font-medium w-full text-left transition ${
                activeTab === "info" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`rounded-full px-4 py-2 text-sm font-medium w-full text-left transition ${
                activeTab === "password" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          {activeTab === "info" && (
            <>
              <h3 className="text-lg font-bold mb-6">Edit Profile Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      name="name"
                      value={userData?.name}
                      onChange={handleProfileChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      name="phone_number"
                      value={userData?.phone_number ?? ""}
                      onChange={handleProfileChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                      name="email"
                      value={userData?.email}
                      readOnly
                      className="w-full bg-gray-100 border rounded px-3 py-2 text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Profile Photo</label>
                    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-6 text-gray-500 cursor-pointer">
                      <span className="flex flex-col items-center">
                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                        Upload Image
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-right">
                <button onClick={handleSaveChanges} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Save Changes</button>
              </div>
            </>
          )}

          {activeTab === "password" && (
            <>
              <h3 className="text-lg font-bold mb-6">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input type="password" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input type="password" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input type="password" className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="mt-6 text-right">
                <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Update Password</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
