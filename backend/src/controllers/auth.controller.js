import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const login = async (req, res) => {
    const {username, password} = req.body;
    try {
        if(!username || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({username});

        if(!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
            
        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        generateToken(user._id, res);

        return res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic
        })
    }
    catch(err) {
     console.log("Error in login", err);
     return res.status(500).json({message: "Internal server error"});
}
};

export const logout = (req, res) => {
    res.clearCookie("jwt");
    return res.status(200).json({message: "Logged out successfully"});
};

export const signup = async (req, res) => {
    const {username, email, password, profilePic} = req.body;
    try {
        if(password.length < 6) {
            return res.status(400).json({message: "Passowrd must be at least 6 characters"});
        }

        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            return res.status(400).json({ message: "Username can only contain letters and numbers (no spaces or special characters)" });
        }

        if(!username || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({message: "Email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        }
    } catch (error) {
        console.log("Error in sign up", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userID = req.user._id;

        if(!profilePic) {
            return res.status(400).json({message: "Profile picture is required"});
        }

       const picUploadResponse = await cloudinary.uploader.upload(profilePic);

       const updatedUser = await User.findByIdAndUpdate(userID, {profilePic: picUploadResponse.secure_url}, {new: true});

       res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile", error);
        return res.status(500).json({message: "Internal server error"});  
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in authentication", error.message);
        res.staus(500).json({message: "Internal server error"})
    }
}