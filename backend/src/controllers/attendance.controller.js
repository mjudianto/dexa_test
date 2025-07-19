const attendanceService = require('../services/attendanceService');

exports.getAllAttendance = async (req, res) => {
  try {
    const attendances = await attendanceService.getAllAttendance();
    res.status(200).json(attendances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAttendanceByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const attendances = await attendanceService.getAttendanceByUserId(userId);
    res.status(200).json(attendances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAttendance = async (req, res) => {
  const user_id = req.body.user_id;

  try {
    const newAttendance = await attendanceService.createAttendance(user_id);
    res.status(201).json(newAttendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCheckOut = async (req, res) => {
  const user_id = req.body.user_id;

  try {
    const updatedAttendance = await attendanceService.updateCheckOut(user_id);
    res.status(200).json(updatedAttendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { check_in, check_out } = req.body;

  try {
    const updated = await attendanceService.updateAttendance(id, check_in, check_out);
    res.status(200).json({ message: 'Attendance record updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await attendanceService.deleteAttendance(id);
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
