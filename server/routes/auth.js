const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Kiểm tra đầu vào
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
        }

        // Mã hóa mật khẩu với argon2
        const hashedPassword = await argon2.hash(password);

        // Tạo người dùng mới
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        // Tạo token JWT
        const acessToken = jwt.sign({ userId: newUser._id },process.env.ACCESS_TOKEN_SECRET);
        res.status(201).json({ success: true, message: 'Đăng ký thành công' ,acessToken});

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra đầu vào
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Email không đúng' });
        }

        // Kiểm tra mật khẩu
        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không đúng' });
        }

        // Tạo token JWT
        const acessToken = jwt.sign({ userId: user._id },process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({ success: true, message: 'Đăng nhập thành công', acessToken });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
});
module.exports = router;
