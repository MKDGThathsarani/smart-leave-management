const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.get('/', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        employeeId: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role, department, casualBalance, sickBalance, annualBalance } = req.body;
    
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role, department, casualBalance, sickBalance, annualBalance }
    });
    
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;