import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context/AuthContext"; // Use AuthContext to access user and token
import { updateUserProfile, updateUserPassword } from "@/lib/user"; // Import functions from user lib

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"none" | "info" | "password">("info");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Use context for handling authentication state
  const { user, token, updateUser } = useAuthContext();
  const router = useRouter();

  // Local state for form values
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone_number: user?.phone_number || "",
    email: user?.email || "",
    profile_file: null as File | null,
  });

  useEffect(() => {
    if (token && user) {
      if (user.profile_picture) {
        setPreview(`http://localhost:5050/uploads/${user.profile_picture}`);
      }
      // Initialize form data
      setFormData({
        name: user.name,
        phone_number: user.phone_number || "",
        email: user.email,
        profile_file: null,
      });
    }
  }, [token, user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFormData(prev => ({ ...prev, profile_file: file }));
    }
  };

  const handleSaveChanges = async () => {
    if (!user || !token) return;

    setLoading(true);
    const form = new FormData();
    form.append("name", formData.name);
    form.append("phone_number", formData.phone_number || "");
    if (formData.profile_file) {
      form.append("profile_file", formData.profile_file);
    }

    try {
      await updateUserProfile(user.id, token, form);

      await updateUser();

      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user || !currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      await updateUserPassword(user.id, token, currentPassword, newPassword);

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

  const handleHomeClick = () => router.push("/");

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navigation Bar */}
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
          <div className="h-24 bg-gray-100 w-full" />
          <div className="flex justify-center -mt-12">
            {preview ? (
              <Image
                src={preview}
                alt="Profile Preview"
                width={80}
                height={80}
                className="rounded-full border-4 border-white object-cover shadow"
                unoptimized
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow">
                {user?.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-center px-6 py-4">
            <h2 className="text-lg font-semibold text-blue-600">{user?.name}</h2>
            <p className="text-sm text-gray-700">{user?.position.division}-{user?.position.description}</p>
          </div>
          <div className="border-t divide-y">
            <div className="flex justify-between px-6 py-3 text-sm">
              <span className="text-gray-500">Email</span>
              <span className="text-blue-600 break-all">{user?.email}</span>
            </div>
          </div>
          <div className="border-t divide-y">
            <div className="flex justify-between px-6 py-3 text-sm">
              <span className="text-gray-500">Phone</span>
              <span className="text-blue-600 break-all">{user?.phone_number}</span>
            </div>
          </div>
          <div className="mt-4 px-6 pb-4 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("info")}
              className={`rounded-full px-4 py-2 text-sm font-medium w-full text-left transition ${activeTab === "info" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >Edit Profile</button>
            <button
              onClick={() => setActiveTab("password")}
              className={`rounded-full px-4 py-2 text-sm font-medium w-full text-left transition ${activeTab === "password" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >Change Password</button>
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
                      value={formData.name}
                      onChange={handleProfileChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      name="phone_number"
                      value={formData.phone_number ?? ""}
                      onChange={handleProfileChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                      name="email"
                      value={formData.email}
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
                >{loading ? 'Saving...' : 'Save Changes'}</button>
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
