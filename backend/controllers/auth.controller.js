import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto"

import adminModel from "../models/admin.model.js";
import config from "../config/config.js";
import transporter from "../config/sendEmail.js"
import generateResetToken from "../utils/generateToken.js";



const registerAdmin = async (req, res) => {
    try {
        // console.log("gisfod")
        let { admin_name, email, password } = req.body;
        if (!admin_name || !email || !password) {
            return res.status(400).json({
                message: "Admin Name,email and password is required field is missing "
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            })
        }
        const existingAdmin = await adminModel.findOne({ email })

        if (existingAdmin) {
            return res.status(409).json({
                message: "Admin already exist",
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain a 8 character",
            })
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            return res.status(400).json({
                message: "Invaid password format"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const Admin = await adminModel.create({
            admin_name,
            email,
            password: hashPassword,
        })

        return res.status(201).json({
            message: "Admin register successfully",
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        })

    }
}

const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "email and password is required",
            })
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            })
        }
        const admin = await adminModel.findOne({ email })

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
            })
        }

        // if(password.length < 8){
        //     return res.status(409).json({
        //         message:"Password must contain a 8 character",
        //     })
        // }else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)){
        //     return res.status(409).json({
        //         message:"Invaid password format"
        //     })
        // }

        const passwordMatch = await bcrypt.compare(password, admin.password)

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password "
            })
        }

        const refreshToken = jwt.sign({
            id: admin._id
        },
            config.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const accessToken = jwt.sign({
            id: admin._id
        },
            config.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        )

        return res.status(200).json({
            message: "Admin login successful",
            data: admin._id,
            accessToken,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "internal server error",
        })

    }
}


const adminForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(process.env.VITE_URL);

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            })
        }
        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            })
        }

        const resetToken = generateResetToken();

        admin.resetPasswordToken = resetToken;
        admin.resetPasswordExpires = Date.now() + 3600000;
        await admin.save();

        const resetPasswordLink = `${process.env.VITE_URL}/reset-password/${resetToken}`;

        await transporter.sendMail({
            to: email,
            subject: "Password Reset Request",
            html: `<h3>Password Reset Request</h3>
                    <p>You requested a password reset. Click the link below to reset your password:</p>
                    <a href="${resetPasswordLink}">Reset Password</a>`
        })

       return res.status(200).json({
    message: "Password reset link generated successfully",
    resetToken,          // Only for development
    resetPasswordLink    // Only for development
});

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        })
    }

}


const adminResetPassword = async (req, res) => {
    try {
        let { newPassword, confirmPassword } = req.body;
        const { resetPasswordToken } = req.params;

        // ✅ Validate token
        if (!resetPasswordToken) {
            return res.status(400).json({
                message: "Reset password token is required",
            });
        }

        // ✅ Validate inputs
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "newPassword & confirmPassword are required",
            });
        }

        newPassword = newPassword.trim();
        confirmPassword = confirmPassword.trim();

        // ✅ Length check
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }

        // ✅ Match check
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        // ✅ Strong password check
        if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)
        ) {
            return res.status(400).json({
                message:
                    "Password must include uppercase, lowercase, number, and special character",
            });
        }

        console.log("Token from URL:", resetPasswordToken);

        // ✅ Find user with expiry check
        const admin = await adminModel.findOne({
            resetPasswordToken,
            // resetPasswordExpires: { $gt: Date.now() },
        });
            console.log(admin);
        if (!admin) {
            return res.status(400).json({
                message: "Invalid or expired token",
            });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        admin.password = hashedPassword;

        // ✅ IMPORTANT: clear reset fields
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;

        await admin.save();

        return res.status(200).json({
            message: "password reset successfully"
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const adminChangePassword = async(req,res) => {
    try{
        let { oldPassword,newPassword,confirmPassword, adminId} = req.body;
        if(!adminId || !oldPassword || !newPassword || !confirmPassword){
            return res.status(400).json({
                message:"adminId, oldPssword, newPassword & confirmPassword is required"
            })
        }

        oldPassword = oldPassword.trim();
        newPassword = newPassword.trim();
        confirmPassword = confirmPassword.trim();

        const admin = await adminModel.findById(adminId);

        if(!admin){
            return res.status(404).json({
                message:"Admin not found"
            })
        }

        const passwordMatch = await bcrypt.compare(oldPassword,admin.password)

        if(!passwordMatch){
            return res.status(401).json({
                message:"Old password is incorrect",
            })
        }

        if(oldPassword.length < 8 || newPassword.length < 8 || confirmPassword.length < 8){
            return res.status(400).json({
                 message: "Password must be at least 8 characters",
            })   
        }

            if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword) || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(confirmPassword)
        ) {
            return res.status(400).json({
                message:
                    "Password must include uppercase, lowercase, number, and special character",
            });
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message:"newPassword & confirmPassword not match"
            })
        } 

         const isSame = await bcrypt.compare(newPassword, admin.password);

        if (isSame) {
            return res.status(400).json({
                message: "New password cannot be same as old password",
            });
        }
        const newHashPassword = await bcrypt.hash(newPassword,10);

        admin.password = newHashPassword;
        await admin.save();

        return res.status(200).json({
            message:"Password change successfull"
        })        

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const getAdmin = async(req,res) => {
    try{
        console.log()
        const { adminId } = req.body

        if(!adminId){
            return res.status(400).json({
                message:"adminId is required",
            })
        }

        const admin = await adminModel.findById(adminId);

        if(!admin){
            return res.status(404).json({
                message:"Admin not found"
            })
        }

        return res.status(200).json({
            message:"admin fatch successfully",
            data:admin
        })

    }catch(error){
        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export {registerAdmin, adminLogin,adminForgotPassword,adminResetPassword,adminChangePassword, getAdmin}
