// pages/login.tsx or app/login/page.tsx

import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import Modal from "@/components/Modal";
import { loginUser } from "@/lib/auth"; 
import { useRouter } from 'next/router'; 

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginError, setLoginError] = useState("");

  const router = useRouter(); // useRouter hook for redirection

  const validateEmail = (value: string) => {
    setEmail(value);
    if (!value.endsWith("@dexagroup.com")) {
      setEmailError(true);
      setErrorMessage("Please use your company email (@dexagroup.com)");
    } else {
      setEmailError(false);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateEmail(email);
    setLoginError("");

    try {
      const userData = await loginUser(email, password);

      router.push("/")
    } catch (err: any) {
      setLoginError(err.message || "Login failed");
    }
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen grid grid-rows-[15%_85%] md:grid-rows-none md:grid-cols-2`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center bg-white p-10">
        <Image
          src="/logo dexa.jpg"
          alt="Dexa Logo"
          width={400}
          height={400}
          className="max-w-full h-auto"
        />
      </div>

      {/* Login Panel */}
      <div className="bg-gradient-to-r from-[#b0241b] via-[#f24d3c] to-[#bf1e1e] flex items-center justify-center p-10 text-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8">Dexa Attendance</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Enter email"
                className="w-full border-b bg-transparent outline-none text-white placeholder-white/70 py-2"
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
              />
              {errorMessage && (
                <div className="text-sm text-red-600 font-medium mt-1 bg-white px-3 py-1 rounded">
                  {errorMessage}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                className="w-full border-b bg-transparent outline-none text-white placeholder-white/70 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error */}
            {loginError && (
              <div className="text-sm text-red-600 font-medium bg-white px-3 py-2 rounded">
                {loginError}
              </div>
            )}

            {/* Footer */}
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
                Don&apos;t have an account?
              </button>
            </div>

            <button
              type="submit"
              className="mt-4 w-full border rounded-full py-2 hover:bg-white hover:text-red-700 transition-all duration-150"
              disabled={!!emailError}
            >
              Sign in
            </button>
          </form>
        </div>
      </div>

      <Modal show={showRegister} onClose={() => setShowRegister(false)}>
        <h2 className="text-xl font-semibold mb-4 text-black">Register Account</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full border px-3 py-2 rounded" />
          <input type="email" placeholder="Email" className="w-full border px-3 py-2 rounded" />
          <input type="password" placeholder="Password" className="w-full border px-3 py-2 rounded" />
          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
          >
            Register
          </button>
        </form>
      </Modal>

      <Modal show={showReset} onClose={() => setShowReset(false)}>
        <h2 className="text-xl font-semibold mb-4 text-black">Reset Password</h2>
        <form className="space-y-4">
          <input type="email" placeholder="Enter your email" className="w-full border px-3 py-2 rounded" />
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
