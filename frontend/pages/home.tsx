import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function HomePage() {
  const profileImage = null;

  return (
    <div className={`${geistSans.className} ${geistMono.className} font-sans bg-gray-100 min-h-screen`}>
      
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
            Welcome to Dexa Attendance
          </span>
        </div>
      </nav>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-1">
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-lg font-semibold mb-4">Profile</h2>
              <div className="flex items-center gap-4">
                <Image
                  src={profileImage || "/profile placeholder.png"}
                  alt="Profile"
                  width={60}
                  height={60}
                  className="rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/profile placeholder.png";
                  }}
                />

                <div>
                  <p className="font-medium text-gray-800">Mathew Judianto</p>
                  <p className="text-sm text-gray-500">mathew.judianto@dexagroup.com</p>
                  <p className="text-sm text-gray-500">IT Department</p>
                </div>
              </div>
              <div className="mt-6 space-x-4">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
                  Check In
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">
                  Check Out
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-lg font-semibold mb-4">Quick Menu</h2>
              <ul className="space-y-3">
                <li>
                  <a href="/profile" className="text-blue-600 hover:underline">
                    View Profile Details
                  </a>
                </li>
                <li>
                  <a href="/attendance" className="text-blue-600 hover:underline">
                    View Full Attendance Log
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow p-5 overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Attendance Summary</h2>
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Check-In</th>
                  <th className="py-2 px-4">Check-Out</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "2025-07-15", in: "08:01", out: "17:03", status: "Present" },
                  { date: "2025-07-14", in: "08:12", out: "17:00", status: "Late" },
                  { date: "2025-07-13", in: "-", out: "-", status: "Absent" },
                ].map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{item.date}</td>
                    <td className="py-2 px-4">{item.in}</td>
                    <td className="py-2 px-4">{item.out}</td>
                    <td
                      className={`py-2 px-4 font-medium ${
                        item.status === "Absent"
                          ? "text-red-600"
                          : item.status === "Late"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
