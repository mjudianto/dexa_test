const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware.verifyToken, attendanceController.getAllAttendance);
router.get('/:id', authMiddleware.verifyToken, attendanceController.getAttendanceByUserId);
router.post('/', authMiddleware.verifyToken, attendanceController.createAttendance);
router.post('/checkout/', authMiddleware.verifyToken, attendanceController.updateCheckOut);
router.put('/:id', authMiddleware.verifyToken, attendanceController.updateAttendance);
router.delete('/:id', authMiddleware.verifyToken, attendanceController.deleteAttendance);

module.exports = router;
