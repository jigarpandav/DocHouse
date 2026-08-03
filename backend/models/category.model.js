import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:[true, "Admin id is required"]
    },
    name:{
        type: String,
        required:[true,"Category name is required"],
        minlength:3,
        trim: true,
    },
    description:{
        type:String,
        trim: true,
        default: ""
    }
},
{
    timestamps:true
})

const Category = mongoose.model("Category", categorySchema);

export default Category;