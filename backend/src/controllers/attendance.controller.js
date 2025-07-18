const db = require('../models');
const Attendance = db.Attendance;
const User = db.MasterUser;
const { Op } = require('sequelize');
const moment = require('moment');

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const attendances = await Attendance.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'], // Include relevant user info
      }],
    });

    // Group attendance by user ID
    const groupedByUserId = attendances.reduce((group, attendance) => {
      const userId = attendance.user.id;
      if (!group[userId]) {
        group[userId] = {
          user: attendance.user, // Store user details
          records: [] // Store their attendance records
        };
      }
      group[userId].records.push(attendance);
      return group;
    }, {});

    res.status(200).json(groupedByUserId);  // Return all attendance records
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get attendance by user ID
exports.getAttendanceByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const attendances = await Attendance.findAll({
      where: { user_id: userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      }],
    });

    if (attendances.length === 0) {
      return res.status(200).json([]); // Return empty array if no records
    }

    res.status(200).json(attendances); // Return found records
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new attendance record (check-in)
exports.createAttendance = async (req, res) => {
  const user_id = req.body.user_id;
  const todayStart = moment().startOf('day').toDate(); // Midnight today
  const todayEnd = moment().endOf('day').toDate(); // End of today

  try {
    // Check if the user has already checked in today
    const existingCheckIn = await Attendance.findOne({
      where: {
        user_id,
        check_in: { [Op.between]: [todayStart, todayEnd] },
      },
    });

    if (existingCheckIn) {
      return res.status(400).json({ message: 'You have already checked in today.' });
    }

    // Create a new check-in record
    const newAttendance = await Attendance.create({
      user_id,
      check_in: new Date(), // Current date and time for check-in
      check_out: null, // Set check-out to null initially
    });

    res.status(201).json(newAttendance);  // Return the new attendance record
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update check-out time
exports.updateCheckOut = async (req, res) => {
  const user_id = req.body.user_id;
  const todayStart = moment().startOf('day').toDate();
  const todayEnd = moment().endOf('day').toDate();

  try {
    // Check if a check-in exists for today
    const existingCheckIn = await Attendance.findOne({
      where: {
        user_id,
        check_in: { [Op.between]: [todayStart, todayEnd] },
      },
    });

    if (!existingCheckIn) {
      return res.status(400).json({ message: 'You have not checked in today.' });
    }

    // Check if a checkout already exists
    const existingCheckOut = await Attendance.findOne({
      where: {
        user_id,
        check_in: { [Op.between]: [todayStart, todayEnd] },
        check_out: { [Op.between]: [todayStart, todayEnd] },
      },
    });

    if (existingCheckOut) {
      return res.status(400).json({ message: 'You already checked out today.' });
    }

    // Update the check-out time for the existing record
    const [updated] = await Attendance.update(
      { check_out: new Date() },  // Set the current date and time for check-out
      { where: { id: existingCheckIn.id } }
    );

    if (updated) {
      const updatedAttendance = await Attendance.findByPk(existingCheckIn.id);
      res.status(200).json(updatedAttendance);  // Return the updated attendance record
    } else {
      res.status(500).json({ message: 'Failed to update checkout time.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing attendance record (check-in or check-out)
exports.updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { check_in, check_out } = req.body;

  try {
    // Update attendance record by ID
    const [updated] = await Attendance.update(
      { check_in, check_out },
      { where: { id } }
    );

    if (updated) {
      res.status(200).json({ message: 'Attendance record updated successfully' });
    } else {
      res.status(404).json({ message: 'Attendance record not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an attendance record
exports.deleteAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the attendance record by ID
    const deleted = await Attendance.destroy({ where: { id } });

    if (deleted) {
      res.status(200).json({ message: 'Attendance record deleted successfully' });
    } else {
      res.status(404).json({ message: 'Attendance record not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
