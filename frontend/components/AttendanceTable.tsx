import React from 'react';
import { format } from "date-fns";

const formatFullDate = (date: string | null) => {
    if (!date) return ""; 
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return "";
    }
    return format(parsedDate, 'yyyy-MM-dd HH:mm'); 
  };

const AttendanceTable = ({ groupedData }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs uppercase bg-gray-100">
          <tr>
            <th className="px-4 py-2 cursor-pointer hover:text-blue-600">User</th>
            <th className="px-4 py-2 cursor-pointer hover:text-blue-600">Check In</th>
            <th className="px-4 py-2 cursor-pointer hover:text-blue-600">Check Out</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedData).map(([userId, { user, records }]) => (
            <React.Fragment key={userId}>
              {/* Group Header: User's Name */}
              <tr className="bg-gray-200">
                <td colSpan="3" className="px-4 py-2 font-bold text-gray-900">
                  {user.name}
                </td>
              </tr>
              {/* Attendance Rows */}
              {records.map((attendance, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2 font-medium text-gray-900">{user.name}</td> {/* User Name */}
                  <td className="px-4 py-2">{formatFullDate(attendance.check_in)}</td>
                  <td className="px-4 py-2">{formatFullDate(attendance.check_out)}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
