
export interface ValidationErrors {
  [key: string]: string;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'landlord' | 'tenant';
}

// Allowed email domains
const ALLOWED_DOMAINS = ['@gmail.com', '@yahoo.com', '@outlook.com', '@mgit.ac.in', '@hotmail.com'];

// Email validation with domain restriction
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  
  // Check if email ends with one of the allowed domains
  const isAllowedDomain = ALLOWED_DOMAINS.some(domain => email.toLowerCase().endsWith(domain.toLowerCase()));
  return isAllowedDomain;
};

// Mobile number validation (supports various formats)
export const validateMobileNumber = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  // Check if it's between 10-15 digits (international format)
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

// Real-time validation
export const validateField = (field: string, value: string, formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  switch (field) {
    case 'email':
      if (value && !validateEmail(value)) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          errors.email = 'Email must be from an allowed domain (@gmail.com, @yahoo.com, @outlook.com, @mgit.ac.in, @hotmail.com)';
        }
      }
      break;
    case 'phone':
      if (value && !validateMobileNumber(value)) {
        errors.phone = 'Please enter a valid mobile number (10-15 digits)';
      }
      break;
    case 'password':
      if (value && value.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }
      break;
    case 'confirmPassword':
      if (value && value !== formData.password) {
        errors.confirmPassword = 'Passwords do not match';
      }
      break;
    case 'name':
      if (value && value.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
      }
      break;
  }
  
  return errors;
};

// Validate all fields
export const validateAllFields = async (formData: FormData): Promise<ValidationErrors> => {
  const errors: ValidationErrors = {};
  
  if (!formData.name.trim() || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  if (!validateEmail(formData.email)) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    } else {
      errors.email = 'Email must be from an allowed domain (@gmail.com, @yahoo.com, @outlook.com, @mgit.ac.in, @hotmail.com)';
    }
  }
  
  if (formData.phone && !validateMobileNumber(formData.phone)) {
    errors.phone = 'Please enter a valid mobile number';
  }
  
  if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};
