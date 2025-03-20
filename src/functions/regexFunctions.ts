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
// - Uppercase letter (A-Z)
// - Digits (0-9)
// - Underscores (_)
export const isValidUsername = (username: string) => {
  return /^[a-zA-Z0-9_]+$/.test(username);
};

// Ensures a team name / league name contains only:
// - Lowercase letters (a-z)
// - Uppercase letters (A-Z)
// - Digits (0-9)
// - Spaces ( )
export const isValidTeamOrLeagueName = (name: string) => {
  return /^(?=.*[a-zA-Z]).{3,}$/.test(String(name).trim());
};
