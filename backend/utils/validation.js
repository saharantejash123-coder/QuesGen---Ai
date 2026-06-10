/**
 * Email validation utilities
 */

/**
 * Check if an email is a Gmail account
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is a Gmail account
 */
const isGmailAccount = (email) => {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();
  return normalizedEmail.endsWith('@gmail.com');
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email has valid format
 */
const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  return { isValid: true, message: 'Password is valid' };
};

module.exports = {
  isGmailAccount,
  isValidEmail,
  validatePassword
};
