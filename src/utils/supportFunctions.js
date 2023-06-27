// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const phoneNumberRegex = /^\d{10}$/;

export const isEmptyValue = (value, id, setErrors) => {
  if (!value?.trim()) {
    setErrors(prev => ({...prev, [id]: `${id} is required`}));
    return true;
  }
  setErrors(prev => ({...prev, [id]: ''}));
  return false;
};

export const doesNotMatchRegEx = (value, id, setErrors) => {
  if (!passwordRegex.test(value || '')) {
    setErrors(prev => {
      if (!prev[id])
        return {...prev, [id]: `${id}  must be at least 3 character!`};
      return prev;
    });
    return true;
  }
  setErrors(prev => ({...prev, [id]: ''}));
  return false;
};

export const isValid = (label, value, type) => {
  if (!value?.trim()) return `${label} is required`;
  if (!type) return '';
  if (type === 'email' && !emailRegex.test(value)) return 'Invalid email.';
  if (type === 'password' && !passwordRegex.test(value))
    return 'Password must be at least 6 characters and contain at least 1 capital letter,1 small letter, 1 special character and 1 number.';
  if (type === 'username' && !usernameRegex.test(value))
    return 'Invalid username.';
  if (type === 'phonenumber' && !phoneNumberRegex.test(value))
    return 'Invalid phone number.';
  return '';
};
