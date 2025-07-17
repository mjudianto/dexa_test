const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');


router.get('/', authMiddleware.verifyToken, userController.getAllUsers);
router.get('/:id', authMiddleware.verifyToken, userController.getUser);
router.post('/', authMiddleware.verifyToken, userController.createUser);
router.put('/:id', authMiddleware.verifyToken, upload.single('profile_file'), userController.updateUser);
router.delete('/:id', authMiddleware.verifyToken, userController.deleteUser);
router.put('/:id/password', authMiddleware.verifyToken, userController.updatePassword);

module.exports = router;
