import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllUserAttendance } from "@/lib/attendance";
import AttendanceTable from "@/components/AttendanceTable";
import Image from "next/image";
import { User } from '@/types/User';
import { useAuthContext } from "@/context/AuthContext"; 
import { useNotifications } from '@/hooks/useNotifications';

export default function HomePage() {
  const { admin, token } = useAuthContext(); // Use AuthContext to get user and token
  const [attendanceData, setAttendanceData] = useState({});
  const [adminData, setAdminData] = useState<User | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 5;
  const router = useRouter();

  const fetchAttendance = async () => {
    const attendance = await getAllUserAttendance(token ?? "");
    setAttendanceData(attendance);
  };

  useNotifications((message) => {
    // This function will run every time a message is received
    
    // Show a browser alert with the message
    alert(`New Notification: ${message}`);
    
    // Optionally, re-fetch the attendance data to keep the page live
    fetchAttendance();
  });

  useEffect(() => {
    if (token) {
      fetchAttendance();
      const adminDataString = localStorage.getItem('adminData');
      const localAdminData = JSON.parse(adminDataString || null);
      if (localAdminData){
        setAdminData(localAdminData)
      }
    }

  }, [token, router]);

  // Helper function to format dates
  const formatDate = (date: string | null) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return "";
    }
    return parsedDate.toISOString().split('T')[0]; // Returns date in 'YYYY-MM-DD'
  };

  // Helper function to format full date (for check-in and check-out)
  const formatFullDate = (date: string | null) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return "";
    }
    return parsedDate.toISOString(); // Returns full date in ISO format
  };

  // Filter attendance by date and search query
  const filterAttendance = () => {
    let filtered = Object.entries(attendanceData).map(([userId, userData]) => {
      // Filter records by date range
      const records = userData.records.filter((attendance) => {
        const checkInDate = formatDate(attendance.check_in);

        if (fromDate && checkInDate < fromDate) return false;
        if (toDate && checkInDate > toDate) return false;

        if (search) {
          const checkOutDate = formatDate(attendance.check_out);
          if (
            !checkInDate.includes(search) &&
            (checkOutDate && !checkOutDate.includes(search))
          ) {
            return false;
          }
        }

        return true;
      });


      return { user: userData.user, records };
    });

    // Remove users who have no matching records
    filtered = filtered.filter(user => user.records.length > 0);

    // Sort records for each user by check-in date (latest first)
    filtered.forEach(user => {
      user.records.sort((a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime());
    });

    return filtered;
  };

  // Filtered attendance
  const filteredAttendance = filterAttendance();

  // Pagination logic
  const totalPages = Math.ceil(filteredAttendance.length / dealsPerPage);
  const paginatedData = filteredAttendance.slice(
    (currentPage - 1) * dealsPerPage,
    currentPage * dealsPerPage
  );

  // Handle pagination
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
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
                            src="/profile placeholder.png"
                            alt="Profile"
                            width={60}
                            height={60}
                            className="rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{adminData?.name}</p>
                            <p className="text-sm text-gray-500">{adminData?.email}</p>
                            <p className="text-sm text-gray-500">{adminData?.position?.division} - {adminData?.position?.description}</p>
                          </div>
                        </div>
                      </div>
          
                      <div className="bg-white rounded-xl shadow p-5">
                        <h2 className="text-lg font-semibold mb-4">Quick Menu</h2>
                        <ul className="space-y-3">
                          <li><a href="/admin/profiles" className="text-blue-600 hover:underline">View Profile Details</a></li>
                        </ul>
                      </div>
                    </div>

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

            {/* Table for Attendance Data */}
            <AttendanceTable groupedData={paginatedData} />

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Previous</button>
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
