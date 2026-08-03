import firmModel from "../models/firm.model.js";
import adminModel from "../models/admin.model.js"
import fs from "fs";
import path from "path";
// import admin from "../models/admin.model.js";


    // Create
// createFirm

    // Read
// getFirmById


   // Update
// updateFirm
// updateFirmLogo
// updateFirmQRCode

    // Delete
// deleteFirm


// create firm 


const createFirm = async (req, res) => {
  try {
    
    let {
      adminId, shopName, primaryPhone,
      secondaryPhone, tertiaryPhone,
      address, city, state, pincode,
      upiId, profession
    } = req.body;

    //  Validation
    if (!adminId || !shopName || !primaryPhone || !address || !pincode || !upiId || !profession) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    //  Correct way to get images
    let logo = req.files?.logo?.[0];
    let qrCode = req.files?.qrCode?.[0];

    if (!logo || !qrCode) {
      return res.status(400).json({
        message: "logo & qrCode is required"
      });
    }

    // Admin Fix findById
    let admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    const firm = await firmModel.findOne({ adminId });

    if (firm) {
      return res.status(409).json({
        message: "Firm already exists"
      });
    }

    //  Save only filenames (BEST PRACTICE)
    const newFirm = await firmModel.create({
      adminId,
      shopName,
      primaryPhone,
      secondaryPhone,
      tertiaryPhone,
      address,
      city,
      state,
      pincode,
      upiId,
      profession,
      logo: logo.filename,
      qrCode: qrCode.filename
    });

    return res.status(201).json({
      message: "Firm created successfully",
      data: newFirm
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

    // Read
// getFirmById

const getFirmById = async (req,res) => {
    try{
      
      const { adminId } = req.body;
    
      if(!adminId){
        return res.status(400).json({
          message: "admin id is required"
        })
      }

      let firm = await firmModel.findOne({adminId})

      if(!firm){
        return res.status(404).json({
          message: "Firm is not found"
        })
      }

      return res.status(200).json({
        message: "firm found successfullly",
        data: firm
      })

    }catch(error){
      console.log(error);
      return res.status(500).json({
        message:"Internal server error"
      })
    }
}



   // Update
// updateFirm

const deleteUploadFile = async (filename) => {
  if (!filename) return;

  const filePath = path.join(process.cwd(), "uploads", filename);

  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error("Failed to delete old upload:", error.message);
  }
};

const updateFirm = async (req, res) => {
  try {
    const {
      firmId,
      adminId,
      shopName,
      primaryPhone,
      secondaryPhone,
      tertiaryPhone,
      address,
      city,
      state,
      pincode,
      upiId,
      profession,
    } = req.body;

    if (!firmId && !adminId) {
      return res.status(400).json({
        message: "firmId or adminId is required",
      });
    }

    if (adminId) {
      const admin = await adminModel.findById(adminId);

      if (!admin) {
        return res.status(404).json({
          message: "Admin not found",
        });
      }
    }

    const firm = firmId
      ? await firmModel.findById(firmId)
      : await firmModel.findOne({ adminId });

    if (!firm) {
      return res.status(404).json({
        message: "Firm not found",
      });
    }

    const allowedFields = {
      adminId,
      shopName,
      primaryPhone,
      secondaryPhone,
      tertiaryPhone,
      address,
      city,
      state,
      pincode,
      upiId,
      profession,
    };

    const updateData = {};

    Object.entries(allowedFields).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = typeof value === "string" ? value.trim() : value;
      }
    });

    const newLogo = req.files?.logo?.[0];
    const newQrCode = req.files?.qrCode?.[0];
    const oldLogo = firm.logo;
    const oldQrCode = firm.qrCode;

    if (newLogo) {
      updateData.logo = newLogo.filename;
    }

    if (newQrCode) {
      updateData.qrCode = newQrCode.filename;
    }

    const updatedFirm = await firmModel.findByIdAndUpdate(
      firm._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (newLogo && oldLogo && oldLogo !== newLogo.filename) {
      await deleteUploadFile(oldLogo);
    }

    if (newQrCode && oldQrCode && oldQrCode !== newQrCode.filename) {
      await deleteUploadFile(oldQrCode);
    }

    return res.status(200).json({
      message: "Firm settings updated successfully",
      data: updatedFirm,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};


// updateFirmLogo


const updateFirmLogo = async(req,res) => {
  try{

    let { firmId, adminId} = req.body;

      if( !firmId || !adminId) {
        return res.status(400).json({
          message: " firmId, adminId is require"
        })
      }

      const admin = await adminModel.findById(adminId);

      if(!admin){
        return res.status(404).json({
          message:"admin not found",
        })
      }

      const firm = await firmModel.findById(firmId);

      if(!firm){
        return res.status(404).json({
          message:"firm not found",
        })
      }


    const oldLogo = firm.logo;
    let logo = firm.logo;

    if (req.files?.logo?.length > 0) {
      logo = req.files.logo[0].filename;
    }

    firm.logo = logo;
    await firm.save();

    if (logo !== oldLogo) {
      await deleteUploadFile(oldLogo);
    }

return res.status(200).json({
  message: "Logo updated successfully",
  data: firm,
});

  }catch(error){
    console.log(error);

    return res.status(500).json({
      message: "Internal server error"
    })
  }
}


// updateFirmQRCode


const updateFirmQrCode = async(req,res) => {
  try{

    const {firmId, adminId} = req.body;

      if( !firmId || !adminId) {
        return res.status(400).json({
          message: "firmId, adminId is require"
        })
      }

      const admin = await adminModel.findById(adminId);

      if(!admin){
        return res.status(404).json({
          message:"admin not found",
        })
      }

      const firm = await firmModel.findById(firmId)

      if(!firm){
        return res.status(404).json({
          message:"firm not found",
        })
      }

    const oldQrCode = firm.qrCode;
    let qrCode = firm.qrCode;

    if (req.files?.qrCode?.length > 0) {
      qrCode = req.files.qrCode[0].filename;
    }

    firm.qrCode = qrCode
    await firm.save();

    if (qrCode !== oldQrCode) {
      await deleteUploadFile(oldQrCode);
    }

return res.status(200).json({
  message: "QR Code updated successfully",
  data: firm,
});

  }catch(error){
    console.log(error);

    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

export {
  createFirm,
  getFirmById,
  updateFirm,
  updateFirmLogo,
  updateFirmQrCode,
};

