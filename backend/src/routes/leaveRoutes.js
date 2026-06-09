const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getPendingLeaves,
  approveLeave,
  rejectLeave
} = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/apply', authMiddleware, applyLeave);
router.get('/my-leaves', authMiddleware, getMyLeaves);
router.get('/pending', authMiddleware, roleMiddleware(['HOD', 'DEAN']), getPendingLeaves);
router.put('/approve/:id', authMiddleware, roleMiddleware(['HOD', 'DEAN']), approveLeave);
router.put('/reject/:id', authMiddleware, roleMiddleware(['HOD', 'DEAN']), rejectLeave);

module.exports = router;