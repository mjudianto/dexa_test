require('dotenv').config();
const db = require('../models');
const Attendance = db.Attendance;
const User = db.MasterUser;
const { Op } = require('sequelize');
const { getFromCache, setToCache } = require('../utils/redisCache');  // Import Redis cache functions

// Fetch all attendance records
exports.getAllAttendance = async () => {
  const cacheKey = 'allAttendance';

  // Check Redis cache first
  const cachedAttendance = await getFromCache(cacheKey);
  if (cachedAttendance) return cachedAttendance;

  try {
    const attendances = await Attendance.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      }],
    });
    
    const groupedByUserId = attendances.reduce((group, attendance) => {
      const userId = attendance.user.id;
      if (!group[userId]) {
        group[userId] = {
          user: attendance.user,
          records: []
        };
      }
      group[userId].records.push(attendance);
      return group;
    }, {});

    // Store in cache
    await setToCache(cacheKey, groupedByUserId);
    return groupedByUserId;
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw error;
  }
};

// Fetch attendance by user ID
exports.getAttendanceByUserId = async (userId) => {
  const cacheKey = `attendanceByUserId:${userId}`;

  // Check Redis cache first
  const cachedAttendance = await getFromCache(cacheKey);
  if (cachedAttendance) return cachedAttendance;

  const attendance = await Attendance.findAll({
    where: { user_id: userId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email'],
    }],
  });

  // Store in cache
  if (attendance) await setToCache(cacheKey, attendance);
  return attendance;
};

// Check if a user has already checked in today
exports.checkExistingCheckIn = async (user_id, todayStart, todayEnd) => {
  const cacheKey = `checkInStatus:${user_id}:${todayStart}:${todayEnd}`;

  // Check Redis cache first
  const cachedCheckIn = await getFromCache(cacheKey);
  if (cachedCheckIn) return cachedCheckIn;

  const checkIn = await Attendance.findOne({
    where: {
      user_id,
      check_in: { [Op.between]: [todayStart, todayEnd] },
    },
  });

  // Store in cache
  await setToCache(cacheKey, checkIn);
  return checkIn;
};

// Create a new attendance record (check-in)
exports.createAttendance = async (user_id) => {
  const newAttendance = await Attendance.create({
    user_id,
    check_in: new Date(),
    check_out: null,
  });

  // Invalidate the cache for all attendance and specific user
  await redis.del('allAttendance');
  await redis.del(`attendanceByUserId:${user_id}`);

  return newAttendance;
};

// Check if a user has already checked out today
exports.checkExistingCheckOut = async (user_id, todayStart, todayEnd) => {
  const cacheKey = `checkOutStatus:${user_id}:${todayStart}:${todayEnd}`;

  // Check Redis cache first
  const cachedCheckOut = await getFromCache(cacheKey);
  if (cachedCheckOut) return cachedCheckOut;

  const checkOut = await Attendance.findOne({
    where: {
      user_id,
      check_in: { [Op.between]: [todayStart, todayEnd] },
      check_out: { [Op.between]: [todayStart, todayEnd] },
    },
  });

  // Store in cache
  await setToCache(cacheKey, checkOut);
  return checkOut;
};

// Update the check-out time for a user
exports.updateCheckOut = async (attendanceId) => {
  const updatedCheckOut = await Attendance.update(
    { check_out: new Date() },
    { where: { id: attendanceId } }
  );

  // Invalidate cache for the updated attendance record
  await redis.del(`attendanceByUserId:${attendanceId}`);
  await redis.del('allAttendance');
  
  return updatedCheckOut;
};

// Update an attendance record
exports.updateAttendance = async (id, check_in, check_out) => {
  const updatedAttendance = await Attendance.update(
    { check_in, check_out },
    { where: { id } }
  );

  // Invalidate cache for the updated attendance record
  await redis.del(`attendanceByUserId:${id}`);
  await redis.del('allAttendance');
  
  return updatedAttendance;
};

// Delete an attendance record
exports.deleteAttendance = async (id) => {
  const deletedAttendance = await Attendance.destroy({ where: { id } });

  // Invalidate cache for the deleted attendance record
  await redis.del(`attendanceByUserId:${id}`);
  await redis.del('allAttendance');
  
  return deletedAttendance;
};
