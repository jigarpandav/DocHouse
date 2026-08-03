import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    admin_name:{
        type:String,
        required:[true,"Admin name is required"],
        minlength:[3,"Admin name must be at least 3 characters"],
        trim:true,
    },
    email:{
        type:String,
        required:[true,"Email required"],
        unique:true,
        trim:true,
        lowercase:true,
        match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address",
    ],
    },
    password:{
    type: String,
    required: [true, "Password is required"],
    },
     resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
});

const admin = mongoose.model("Admin",adminSchema);

export default admin;