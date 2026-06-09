const { PrismaClient } = require('@prisma/client');
const { calculateLeaveDays } = require('../utils/leaveCalculator');
const { sendLeaveApplicationEmail, sendEmail } = require('../utils/emailService');

const prisma = new PrismaClient();

const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, documentUrl } = req.body;
    const userId = req.user.id;
    
    const totalDays = calculateLeaveDays(startDate, endDate);
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    let balance = 0;
    if (leaveType === 'CASUAL') balance = user.casualBalance;
    else if (leaveType === 'SICK') balance = user.sickBalance;
    else if (leaveType === 'ANNUAL') balance = user.annualBalance;
    
    if (balance < totalDays && leaveType !== 'WITHOUT_PAY') {
      return res.status(400).json({ message: `Insufficient ${leaveType} leave balance. Available: ${balance}, Required: ${totalDays}` });
    }
    
    const leave = await prisma.leave.create({
      data: {
        userId,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        documentUrl,
        totalDays,
        status: 'PENDING_HOD'
      }
    });
    
    const hod = await prisma.user.findFirst({
      where: { department: user.department, role: 'HOD' }
    });
    
    if (hod) {
      await sendLeaveApplicationEmail(user, leave, hod);
    }
    
    res.status(201).json({ message: 'Leave applied successfully', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const leaves = await prisma.leave.findMany({
      where: { userId: req.user.id },
      include: { approvals: true },
      orderBy: { appliedAt: 'desc' }
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingLeaves = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    
    let statusFilter;
    if (req.user.role === 'HOD') statusFilter = 'PENDING_HOD';
    else if (req.user.role === 'DEAN') statusFilter = 'PENDING_DEAN';
    else return res.status(403).json({ message: 'Not authorized' });
    
    const leaves = await prisma.leave.findMany({
      where: {
        status: statusFilter,
        user: { department: user.department }
      },
      include: { user: true },
      orderBy: { appliedAt: 'asc' }
    });
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const approverRole = req.user.role;
    
    const leave = await prisma.leave.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    });
    
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    
    let newStatus = leave.status;
    
    if (approverRole === 'HOD' && leave.status === 'PENDING_HOD') {
      newStatus = 'PENDING_DEAN';
      await prisma.approval.create({
        data: {
          leaveId: leave.id,
          approverId: req.user.id,
          level: 1,
          status: 'APPROVED',
          comments,
          approvedAt: new Date()
        }
      });
    } else if (approverRole === 'DEAN' && leave.status === 'PENDING_DEAN') {
      newStatus = 'APPROVED';
      await prisma.approval.create({
        data: {
          leaveId: leave.id,
          approverId: req.user.id,
          level: 2,
          status: 'APPROVED',
          comments,
          approvedAt: new Date()
        }
      });
      
      if (leave.leaveType !== 'WITHOUT_PAY') {
        const updateData = {};
        if (leave.leaveType === 'CASUAL') updateData.casualBalance = { decrement: leave.totalDays };
        if (leave.leaveType === 'SICK') updateData.sickBalance = { decrement: leave.totalDays };
        if (leave.leaveType === 'ANNUAL') updateData.annualBalance = { decrement: leave.totalDays };
        
        await prisma.user.update({
          where: { id: leave.userId },
          data: updateData
        });
      }
    } else {
      return res.status(400).json({ message: 'Cannot approve at this stage' });
    }
    
    await prisma.leave.update({
      where: { id: leave.id },
      data: { status: newStatus }
    });
    
    await sendEmail({
      to: leave.user.email,
      subject: `Leave Application ${newStatus}`,
      html: `<p>Your leave application has been ${newStatus}.</p><p>Comments: ${comments || 'No comments'}</p>`
    });
    
    res.json({ message: `Leave ${newStatus} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    
    const leave = await prisma.leave.update({
      where: { id: parseInt(id) },
      data: { status: 'REJECTED' },
      include: { user: true }
    });
    
    await sendEmail({
      to: leave.user.email,
      subject: 'Leave Application Rejected',
      html: `<p>Your leave application has been REJECTED.</p><p>Reason: ${comments || 'Not specified'}</p>`
    });
    
    res.json({ message: 'Leave rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyLeave, getMyLeaves, getPendingLeaves, approveLeave, rejectLeave };