const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const calculateWorkingDays = (startDate, endDate) => {
  let count = 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    if (!isWeekend(d)) {
      count++;
    }
  }
  return count;
};

module.exports = { calculateLeaveDays, isWeekend, calculateWorkingDays };