const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User does not exist' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const userForToken = {
      name: user.name,
      email: user.email,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      token,
      success: true,
      message: 'Signed in successfully',
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

const signup = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res
        .status(409)
        .json({ success: false, message: 'User already exists' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, email, passwordHash });

    const savedUser = await newUser.save();
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: savedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create new user',
      error,
    });
  }
};

module.exports = { login, signup };
