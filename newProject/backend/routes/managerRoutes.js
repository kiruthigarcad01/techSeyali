const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins
} = require('../controller/managerController');

router.post('/createAdmin', verifyToken, allowRoles('manager'), createAdmin);
router.patch('/updateAdmin/:id', verifyToken, allowRoles('manager'), updateAdmin);
router.delete('/deleteAdmin/:id', verifyToken, allowRoles('manager'), deleteAdmin);
router.get('/getAllAdmins', verifyToken, allowRoles('manager'), getAllAdmins);

module.exports = router;
