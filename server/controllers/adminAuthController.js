let Admin = require('../models/Admin.js');
let jwt = require('jsonwebtoken');
let crypto = require('crypto');
// let speakeasy = require('speakeasy');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const loginAdmin = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && await admin.matchPassword(password)) {
    if (admin.twoFactorEnabled) {
      return res.status(200).json({
        requires2FA: true,
        message: '2FA required',
        tempToken: generateToken(admin._id), // temp token for 2FA
      });
    }

    res.json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id),
      rememberMe,
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

const verify2FA = async (req, res) => {
  const { token, twoFactorCode } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: 'base32',
      token: twoFactorCode,
    });

    if (!verified) return res.status(400).json({ message: 'Invalid 2FA code' });

    res.json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  const token = crypto.randomBytes(20).toString('hex');
  admin.resetToken = token;
  admin.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await admin.save();

  // You can use nodemailer here
  console.log(`Reset Link: http://localhost:3000/reset-password/${token}`);

  res.json({ message: 'Password reset link sent' });
};

module.exports = { loginAdmin, forgotPassword, verify2FA, generateToken }










