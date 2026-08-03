import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:[true,"Admin id is required"],
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required: [true, "Category id is required"],
    },
    title:{
        type:String,
        required:[true,"Title is required"],
    },
    required_documents: [
      {
        type: String,
        trim: true,
      },
    ],
},
{
    timestamps:true,
})

const template = mongoose.model("Template",templateSchema);

export default template;