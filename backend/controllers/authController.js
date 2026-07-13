const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc  Register new user (patient or doctor)
// @route POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, specialization, qualifications, experienceYears, consultationFee } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'doctor' ? 'doctor' : 'patient',
      phone,
      specialization,
      qualifications,
      experienceYears,
      consultationFee
    });

    res.status(201).json({
      user: user.toSafeObject(),
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Login user
// @route POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get logged-in user's profile
// @route GET /api/auth/me
const getProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

// @desc  Update logged-in user's profile
// @route PUT /api/auth/me
const updateProfile = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates.password;
    delete updates.role;
    delete updates.email;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };