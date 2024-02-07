import bcrypt from "bcryptjs";

// Function to verify a password against a hashed password
export const verifyPassword = (password, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (err) {
        reject(err); // Handle the error
      } else if (result === true) {
        resolve(true); // Passwords match
      } else {
        resolve(false); // Passwords do not match
      }
    });
  });
};



