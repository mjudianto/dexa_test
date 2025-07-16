import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import Modal from "@/components/Modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (value: string) => {
    setRegisterEmail(value);
    if (!value.endsWith("@dexagroup.com")) {
      setEmailError("Please use your company email (@dexagroup.com)");
    } else {
      setEmailError("");
    }
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen grid grid-rows-[15%_85%] md:grid-rows-none md:grid-cols-2`}
    >
      <div className="flex items-center justify-center bg-white p-10">
        <Image
          src="/logo dexa.jpg"
          alt="Dexa Logo"
          width={400}
          height={400}
          className="max-w-full h-auto"
        />
      </div>

      <div className="bg-gradient-to-r from-[#b0241b] via-[#f24d3c] to-[#bf1e1e] flex items-center justify-center p-10 text-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8">Dexa Attendance</h1>
          <form className="space-y-4">            
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Enter email"
                className="w-full border-b bg-transparent outline-none text-white placeholder-white/70 py-2"
                autoComplete="off"
                onChange={(e) => {
                  const value = e.target.value;
                  validateEmail(value);
                }}
              />
            </div>

            {emailError && (
              <div className="text-sm text-red-600 font-medium -mt-2 mb-1 bg-white px-3 py-1 rounded">
                {emailError}
              </div>
            )}


            <div>
              <label htmlFor="password" className="block text-sm mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                className="w-full border-b bg-transparent outline-none text-white placeholder-white/70 py-2"
              />
            </div>

            <div className="flex justify-between text-sm text-white/80">
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="hover:underline"
              >
                Forgot your password?
              </button>
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="hover:underline"
              >
                Don't have an account?
              </button>
            </div>

            <button
              type="submit"
              className="mt-4 w-full border rounded-full py-2 hover:bg-white hover:text-red-700 transition-all duration-150"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>

      {/* Register */}
      <Modal show={showRegister} onClose={() => setShowRegister(false)}>
        <h2 className="text-xl font-semibold mb-4 text-black">Register Account</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
          >
            Register
          </button>
        </form>
      </Modal>

      {/* Reset Password */}
      <Modal show={showReset} onClose={() => setShowReset(false)}>
        <h2 className="text-xl font-semibold mb-4 text-black">Reset Password</h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
          >
            Send Reset Link
          </button>
        </form>
      </Modal>
    </div>
  );
}
