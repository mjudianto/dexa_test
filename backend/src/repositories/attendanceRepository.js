const db = require('../models');
const Attendance = db.Attendance;
const User = db.MasterUser;
const { Op } = require('sequelize');

// Fetch all attendance records
exports.getAllAttendance = async () => {
  return Attendance.findAll({
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email'],
    }],
  });
};

// Fetch attendance by user ID
exports.getAttendanceByUserId = async (userId) => {
  return Attendance.findAll({
    where: { user_id: userId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email'],
    }],
  });
};

// Check if a user has already checked in today
exports.checkExistingCheckIn = async (user_id, todayStart, todayEnd) => {
  return Attendance.findOne({
    where: {
      user_id,
      check_in: { [Op.between]: [todayStart, todayEnd] },
    },
  });
};

// Create a new attendance record (check-in)
exports.createAttendance = async (user_id) => {
  return Attendance.create({
    user_id,
    check_in: new Date(),
    check_out: null,
  });
};

// Check if a user has already checked out today
exports.checkExistingCheckOut = async (user_id, todayStart, todayEnd) => {
  return Attendance.findOne({
    where: {
      user_id,
      check_in: { [Op.between]: [todayStart, todayEnd] },
      check_out: { [Op.between]: [todayStart, todayEnd] },
    },
  });
};

// Update the check-out time for a user
exports.updateCheckOut = async (attendanceId) => {
  return Attendance.update(
    { check_out: new Date() },
    { where: { id: attendanceId } }
  );
};

// Update an attendance record
exports.updateAttendance = async (id, check_in, check_out) => {
  return Attendance.update(
    { check_in, check_out },
    { where: { id } }
  );
};

// Delete an attendance record
exports.deleteAttendance = async (id) => {
  return Attendance.destroy({ where: { id } });
};
