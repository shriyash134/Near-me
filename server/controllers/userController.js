const User = require("../models/user");

exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      locality,
      city,
      serviceCategories,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = new User({
      name,
      email,
      role,
      phone,
      locality,
      city,
      serviceCategories,
    });

    await User.register(user, password);

    res.status(201).json({
      message: "Signup Successful",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};