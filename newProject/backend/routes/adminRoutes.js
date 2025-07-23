const express = require('express');
const router = express.Router();
const verifyToken  = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const { updateUser, deleteUser,getAllUsers } = require('../controller/adminController');

router.patch('/updateUser/:id', verifyToken, allowRoles('admin'), updateUser);
router.delete('/deleteUser/:id', verifyToken, allowRoles('admin'), deleteUser);
router.get('/getAllUsers',verifyToken,allowRoles('admin'),getAllUsers);



module.exports = router;
