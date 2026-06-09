const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.get('/department', authMiddleware, roleMiddleware(['HOD', 'DEAN', 'ADMIN']), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    
    const leaves = await prisma.leave.findMany({
      where: { user: { department: user.department } },
      include: { user: true },
      orderBy: { appliedAt: 'desc' }
    });
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/summary', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const totalStaff = await prisma.user.count({ where: { role: 'STAFF' } });
    const pendingLeaves = await prisma.leave.count({
      where: { status: { in: ['PENDING_HOD', 'PENDING_DEAN'] } }
    });
    const approvedLeaves = await prisma.leave.count({ where: { status: 'APPROVED' } });
    const rejectedLeaves = await prisma.leave.count({ where: { status: 'REJECTED' } });
    
    res.json({ totalStaff, pendingLeaves, approvedLeaves, rejectedLeaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;