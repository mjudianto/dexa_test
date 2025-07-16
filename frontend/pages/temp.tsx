import Image from "next/image";
import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"none" | "info" | "password">("none");

  const [user, setUser] = useState({
    name: "Mathew Judianto",
    image: "",
    position: "IT Support",
    phone: "08123456789",
    email: "mathew.judianto@dexagroup.com",
    region: "Indonesia",
    bio: "Supporting IT operations with professionalism and care."
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="relative bg-gradient-to-r from-[#b0241b] via-[#f24d3c] to-[#bf1e1e] px-6 py-4 flex items-center shadow">
        <div className="hidden sm:flex items-center gap-3">
          <Image
            src="/logo dexa.jpg"
            alt="Dexa Logo"
            width={100}
            height={40}
            className="object-contain"
          />
        </div>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <span className="text-white font-semibold text-xl tracking-wide text-center">
            Profile
          </span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Left Column: Profile Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
          <div className="h-24 bg-gray-100 w-full" />
          <div className="flex justify-center -mt-12">
            {user.image ? (
              <Image
                src={user.image}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full border-4 border-white object-cover shadow"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow">
                {user.name[0]}
              </div>
            )}
          </div>
          <div className="text-center px-6 py-4">
            <h2 className="text-lg font-semibold text-blue-600">{user.name}</h2>
            <p className="text-sm text-gray-700">{user.position}</p>
            <p className="mt-2 text-sm text-gray-500">{user.bio}</p>
          </div>
          <div className="border-t divide-y">
            <div className="flex justify-between px-6 py-3 text-sm">
              <span className="text-gray-500">Phone</span>
              <span className="text-blue-600">{user.phone}</span>
            </div>
            <div className="flex justify-between px-6 py-3 text-sm">
              <span className="text-gray-500">Email</span>
              <span className="text-blue-600 break-all">{user.email}</span>
            </div>
            <div className="flex justify-between px-6 py-3 text-sm">
              <span className="text-gray-500">Region</span>
              <span className="text-blue-600">{user.region}</span>
            </div>
          </div>
          <div className="mt-4 px-6 pb-4 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("info")}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeTab === "info"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeTab === "password"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Form Panel */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          {activeTab === "info" && (
            <>
              <h3 className="text-lg font-bold mb-4">Edit Profile Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={user.name}
                  onChange={handleProfileChange}
                  className="border rounded px-3 py-2"
                />
                <input
                  name="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={handleProfileChange}
                  className="border rounded px-3 py-2"
                />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={user.phone}
                  onChange={handleProfileChange}
                  className="border rounded px-3 py-2"
                />
                <input
                  name="position"
                  placeholder="Position"
                  value={user.position}
                  onChange={handleProfileChange}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="mt-4 text-right">
                <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeTab === "password" && (
            <>
              <h3 className="text-lg font-bold mb-4">Change Password</h3>
              <div className="space-y-4">
                <input
                  type="password"
                  name="current"
                  placeholder="Current Password"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="password"
                  name="new"
                  placeholder="New Password"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="password"
                  name="confirm"
                  placeholder="Confirm New Password"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div className="mt-4 text-right">
                <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                  Update Password
                </button>
              </div>
            </>
          )}

          {activeTab === "none" && (
            <p className="text-gray-500">Select an option from the left to edit your profile or change your password.</p>
          )}
        </div>
      </div>
    </div>
  );
}