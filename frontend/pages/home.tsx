import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MasterAttendance } from "../types/Attendance";
import { useAuthContext } from "@/context/AuthContext"; // Use AuthContext to access user and token
import { format } from "date-fns";
import { getUserAttendance, checkInAttendance, checkOutAttendance } from "@/lib/attendance"; // API functions

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function HomePage() {
  const { user, token } = useAuthContext(); // Use AuthContext to get user and token
  const [attendanceData, setAttendanceData] = useState<MasterAttendance[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 5; 
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchAttendance();
    }
  }, [token, router]);

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      const attendance = await getUserAttendance(user.id ?? "", token ?? "");
      setAttendanceData(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  // Format date to yyyy-MM-dd
  const formatDate = (date: string | null) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return "";
    }
    return format(parsedDate, "yyyy-MM-dd");
  };

  // Format full date and time (yyyy-MM-dd HH:mm)
  const formatFullDate = (date: string | null) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return "";
    }
    return format(parsedDate, "yyyy-MM-dd HH:mm");
  };

  // Filter attendance data based on date and search criteria
  const filterAttendanceByDate = () => {
    let filtered = [...attendanceData];

    // Filter by From Date
    if (fromDate) {
      filtered = filtered.filter((attendance) => formatDate(attendance.check_in) >= fromDate);
    }

    // Filter by To Date
    if (toDate) {
      filtered = filtered.filter((attendance) => formatDate(attendance.check_in) <= toDate);
    }

    // Search by date
    if (search) {
      filtered = filtered.filter(
        (attendance) =>
          formatDate(attendance.check_in).includes(search) || formatDate(attendance.check_out).includes(search)
      );
    }

    return filtered;
  };

  // Handle Check-In action
  const handleCheckIn = async () => {
    try {
      await checkInAttendance(user?.id ?? "", token ?? "");
      fetchAttendance(); // Refresh the attendance after check-in
    } catch (error) {
      console.error("Error during check-in:", error);
    }
  };

  // Handle Check-Out action
  const handleCheckOut = async () => {
    try {
      await checkOutAttendance(user?.id ?? "", token ?? "");
      fetchAttendance(); // Refresh the attendance after check-out
    } catch (error) {
      console.error("Error during check-out:", error);
    }
  };

  const filteredAttendance = filterAttendanceByDate();

  // Pagination logic
  const totalPages = Math.ceil(filteredAttendance.length / dealsPerPage);
  const paginatedData = filteredAttendance.slice(
    (currentPage - 1) * dealsPerPage,
    currentPage * dealsPerPage
  );

  // Handle page navigation
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className={`${geistSans.className} ${geistMono.className} font-sans bg-gray-100 min-h-screen`}>
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
            Welcome to Dexa Attendance
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="space-y-6 md:col-span-1">
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-lg font-semibold mb-4">Profile</h2>
              <div className="flex items-center gap-4">
                <Image
                  src="/profile placeholder.png"
                  alt="Profile"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-sm text-gray-500">{user?.position?.division} - {user?.position?.description}</p>
                </div>
              </div>
              <div className="mt-6 space-x-4">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded" onClick={handleCheckIn}>
                  Check In
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded" onClick={handleCheckOut}>
                  Check Out
                </button>
              </div>
            </div>

            {/* Quick Menu */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-lg font-semibold mb-4">Quick Menu</h2>
              <ul className="space-y-3">
                <li>
                  <a href="/profile" className="text-blue-600 hover:underline">
                    View Profile Details
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Attendance Summary Section */}
          <div className="md:col-span-2 bg-white rounded-xl shadow p-5 overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Attendance Summary</h2>

            {/* Date Filter */}
            <div className="flex gap-6 mb-4">
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
            </div>

            {/* Search Filter */}
            <div className="flex gap-6 mb-4">
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium">Search</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Date"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
            </div>

            {/* Attendance Data Table */}
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-2 cursor-pointer hover:text-blue-600">Check In</th>
                  <th className="px-4 py-2 cursor-pointer hover:text-blue-600">Check Out</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2 font-medium text-gray-900">{formatFullDate(item.check_in)}</td>
                    <td className="px-4 py-2">{formatFullDate(item.check_out)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
