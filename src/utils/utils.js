// src/utils/utils.js

/**
 * Get the appropriate color for a usage percentage
 * @param {number} percentage - The usage percentage
 * @returns {string} - The Tailwind CSS color class
 */
export const getUsageColor = (percentage) => {
  if (percentage >= 80) return 'text-red-500';
  if (percentage >= 60) return 'text-yellow-500';
  return 'text-green-500';
};

/**
 * Get the appropriate background color for a usage percentage
 * @param {number} percentage - The usage percentage
 * @returns {string} - The Tailwind CSS color class
 */
export const getUsageBgColor = (percentage) => {
  if (percentage >= 80) return 'bg-red-500';
  if (percentage >= 60) return 'bg-yellow-500';
  return 'bg-green-500';
};

/**
 * Get the appropriate color for a cluster status
 * @param {string} status - The cluster status
 * @returns {string} - The Tailwind CSS color class
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'Running':
      return 'bg-green-500';
    case 'Failed':
      return 'bg-red-500';
    case 'Deploying':
      return 'bg-blue-500';
    case 'Terminated':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};

/**
 * Format a number with commas
 * @param {number} num - The number to format
 * @returns {string} - The formatted number
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Format a date to a readable string
 * @param {Date} date - The date to format
 * @returns {string} - The formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};