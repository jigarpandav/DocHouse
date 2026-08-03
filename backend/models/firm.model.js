import mongoose from "mongoose";

const firmSchema= new mongoose.Schema({
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:[true,"AdminId is required"],
    },
    shopName:{
        type:String,
        required:[true,"shop name is required"],
        minlength:3,
        trim:true,
    },
    logo:{
        type:String,
        default:"",
    },
    primaryPhone: {
      type: String,
      required: true,
      trim: true,
      minlength:10,
      maxlength:10
    },

    secondaryPhone: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: (value) => !value || /^[0-9]{10}$/.test(value),
        message: "Secondary phone must be 10 digits",
      },
    },

    tertiaryPhone: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: (value) => !value || /^[0-9]{10}$/.test(value),
        message: "Tertiary phone must be 10 digits",
      },
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
      minlength:6,
      maxlength:6,
    },

    qrCode: {
      type: String,
      default: "",
    },

    upiId: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    
    profession: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }

)

const Firm = mongoose.model("Firm",firmSchema);

export default Firm;
