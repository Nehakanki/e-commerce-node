const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require("dotenv").config();
exports.register = async (req, res,next) => {
    try {
        const { name, email, password, role } = req.body;
       
        if (!name || !email || !password) {
            const error = new Error("Please fill in all required fields");
            error.statusCode = 400;
            return next(error);
          }

        //check for existing USer
        const userExist = await User.findOne({ email });
      
        if (userExist) {
            const error = new Error("User already exists");
            error.statusCode = 400;
            return next(error);
          }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role, 
        });

        
        await newUser.save();

        res.status(200).json({
            success: true,
            message: 'User registration successful',
        });
    } catch (error) {
      
      return  next(error);
    }
};

exports.login = async (req, res, next) => { 
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Please provide email and password");
            error.statusCode = 400;
            return next(error); 
        }

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            return next(error); 
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            return next(error);
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "20d" } 
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
       return next(error); 
    }
};