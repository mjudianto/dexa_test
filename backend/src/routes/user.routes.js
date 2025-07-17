const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware.verifyToken, userController.getAllUsers);
router.get('/:id', authMiddleware.verifyToken, userController.getUser);
router.post('/', authMiddleware.verifyToken, userController.createUser);
router.put('/:id', authMiddleware.verifyToken, userController.updateUser);
router.delete('/:id', authMiddleware.verifyToken, userController.deleteUser);

module.exports = router;
