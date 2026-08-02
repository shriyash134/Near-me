exports.login = (req, res) => {
 
  res.status(200).json({
    success: true,
    
    message: "Login Successful",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
    
  });
};