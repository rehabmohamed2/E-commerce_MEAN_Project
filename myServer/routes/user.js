const express = require("express");
const server = express();
const UserModel = require("../models/user"); 
const bcrypt = require('bcrypt');
const IdCounterModel = require("../models/idCounter");
const jwt = require('jsonwebtoken');
const router = express.Router(); 
const { isAuthenticated, isAdmin } = require('../middleware/auth'); 

server.use(express.json()); 

router.get("/", isAuthenticated, isAdmin, (req, res) => {
    UserModel.find()
      .then(data => res.json({ message: "Users retrieved successfully", data }))
      .catch(err => {
          console.error("Error retrieving users:", err);
          res.status(500).json({ message: "Sorry, can't retrieve users" });
      });
});

router.get("/admin", isAuthenticated, isAdmin, (req, res) => {
    res.status(200).json({ message: 'Welcome to the admin dashboard', user: req.user });
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            console.error("Login failed: User not found for email:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.error("Login failed: Password mismatch for user:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET || 'default_secret', 
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
        
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/createUser", async (req, res) => {
    try {
        const existingUser = await UserModel.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(409).send("You are already registered. Please sign in.");
        }

        const counter = await IdCounterModel.findOneAndUpdate(
            { modelName: 'User' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true } 
        );

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new UserModel({
            ...req.body,
            id: counter.seq, 
            role: 'user',
            password: hashedPassword, 
        });

        await newUser.save();
        res.status(201).send("User created successfully");
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(400).send("Error creating user");
    }
});

router.post('/logout', isAuthenticated, async (req, res) => {
    const userId = req.user.id;
  
    try {
      await Cart.findOneAndDelete({ userId });
      res.status(200).json({ message: 'Logged out and cart cleared' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out', error });
    }
  });
  
  

module.exports = router;
