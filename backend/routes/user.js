require("dotenv").config({
    path: "./.env",
});
const express = require('express');
const passport = require('passport');
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6, { message: "Set at least a 6-length password" }),
    phoneNumber: zod.string().optional()
});

router.post("/", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(410).json({
            message: "Please fill required fields correctly"
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        });
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber || null,
    });
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Incorrect inputs"
        });
    }

    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        const isPasswordValid = req.body.password === user.password; // Replace with bcrypt.compare in real scenario

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while logging in"
        });
    }
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    phoneNumber: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        });
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    });
});

router.get("/google/callback",
    passport.authenticate("google", {
        successRedirect: `${process.env.CLIENT_URL}/dashboard`,
        failureRedirect: `${process.env.CLIENT_URL}`,
    })
);

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect(`${process.env.CLIENT_URL}`);
    });
});

// New route to handle OTP verification signup
router.post("/otp-verify", async (req, res) => {
    const { phoneNumber, firstName, lastName } = req.body;

    const existingUser = await User.findOne({
        phoneNumber: phoneNumber
    });

    if (existingUser) {
        return res.status(411).json({
            message: "Phone number already registered"
        });
    }

    const user = await User.create({
        username: null,
        phoneNumber,
        firstName,
        lastName,
        password: null, // Password is null since OTP signup does not require a password
    });
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });
});

// New route to handle OTP verification sign-in
router.post("/otp-signin", async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while logging in"
        });
    }
});


module.exports = router;
