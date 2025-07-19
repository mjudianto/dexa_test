const attendanceRepository = require('../repositories/attendanceRepository');
const moment = require('moment');
const { Op } = require('sequelize');

exports.getAllAttendance = async () => {
  try {
    return await attendanceRepository.getAllAttendance();
  } catch (err) {
    throw new Error('Error fetching attendance records');
  }
};

exports.getAttendanceByUserId = async (userId) => {
  try {
    return await attendanceRepository.getAttendanceByUserId(userId);
  } catch (err) {
    throw new Error('Error fetching attendance for the user');
  }
};

exports.createAttendance = async (user_id) => {
  const todayStart = moment().startOf('day').toDate();
  const todayEnd = moment().endOf('day').toDate();

  try {
    const existingCheckIn = await attendanceRepository.checkExistingCheckIn(user_id, todayStart, todayEnd);
    if (existingCheckIn) {
      throw new Error('You have already checked in today.');
    }

    return await attendanceRepository.createAttendance(user_id);
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.updateCheckOut = async (user_id) => {
  const todayStart = moment().startOf('day').toDate();
  const todayEnd = moment().endOf('day').toDate();

  try {
    const existingCheckIn = await attendanceRepository.checkExistingCheckIn(user_id, todayStart, todayEnd);
    if (!existingCheckIn) {
      throw new Error('You have not checked in today.');
    }

    const existingCheckOut = await attendanceRepository.checkExistingCheckOut(user_id, todayStart, todayEnd);
    if (existingCheckOut) {
      throw new Error('You already checked out today.');
    }

    return await attendanceRepository.updateCheckOut(existingCheckIn.id);
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.updateAttendance = async (id, check_in, check_out) => {
  try {
    const updated = await attendanceRepository.updateAttendance(id, check_in, check_out);
    if (!updated) {
      throw new Error('Attendance record not found');
    }
    return updated;
  } catch (err) {
    throw new Error('Error updating attendance record');
  }
};

exports.deleteAttendance = async (id) => {
  try {
    const deleted = await attendanceRepository.deleteAttendance(id);
    if (!deleted) {
      throw new Error('Attendance record not found');
    }
    return deleted;
  } catch (err) {
    throw new Error('Error deleting attendance record');
  }
};
