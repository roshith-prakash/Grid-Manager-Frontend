// Check if input is a valid email
export const isValidEmail = (email: string) => {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

// Check if password has :
//  - At least 8 characters
//  - An uppercase character
//  - A lowercase character
//  - A number
//  - An special character
export const isValidPassword = (password: string) => {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
    password
  );
};

// Ensures a username contains only:
// - Lowercase letters (a-z)
// - Digits (0-9)
// - Underscores (_)
export const isValidUsername = (username: string) => {
  return /^[a-z0-9_]+$/.test(username);
};
