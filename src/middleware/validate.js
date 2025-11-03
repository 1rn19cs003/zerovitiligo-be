// const validateRegister = (req, res, next) => {
//   const { email, password, name } = req.body;
  
//   if (!email || !password || !name) {
//     return res.status(400).json({
//       success: false,
//       message: 'Email, password, and name are required'
//     });
//   }
  
//   if (password.length < 6) {
//     return res.status(400).json({
//       success: false,
//       message: 'Password must be at least 6 characters long'
//     });
//   }
  
//   next();
// };

// const validateLogin = (req, res, next) => {
//   const { email, password } = req.body;
  
//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: 'Email and password are required'
//     });
//   }
  
//   next();
// };

// module.exports = {
//   validateRegister,
//   validateLogin
// };