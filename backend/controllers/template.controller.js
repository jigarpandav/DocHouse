// createTemplate
// getAllTemplates
// getTemplateById
// updateTemplate
// deleteTemplateById
//deleteAllTemplate



import adminModel from "../models/admin.model.js";
import templateModel from "../models/template.model.js"


const createTemplate = async (req, res) => {
    try {
        let { title, required_documents, adminId, categoryId } = req.body;

if (typeof required_documents === "string") {
    required_documents = JSON.parse(required_documents);
}

        if (
            !title ||
            !adminId ||
            !categoryId ||
            !Array.isArray(required_documents) ||
            required_documents.length === 0
        ) {
            return res.status(400).json({
                message: "Required fields are missing",
            });
        }
        // Remove extra spaces
        required_documents = required_documents.map(item => item.trim());

        // Check for duplicates
        const uniqueDocuments = new Set(required_documents);

        if (uniqueDocuments.size !== required_documents.length) {
            return res.status(400).json({
                message: "Duplicate required documents are not allowed",
            });
        }

        let admin = await adminModel.findById(adminId);

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
            })
        }

        title = title.trim()

       let template = await templateModel.findOne({
        adminId,
        title,
        });

        if (template) {
            return res.status(409).json({
                message: "Template already exists"
            })
        }

        let newTemplate = await templateModel.create({
            categoryId,
            adminId,
            title,
            required_documents,
        })

        return res.status(201).json({
            message: "Template created successfully",
            data: newTemplate,
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error "
        })
    }
}

const updateTemplate = async (req, res) => {
    try {
        let { templateId, title, adminId, required_documents, categoryId } = req.body;

        if (!templateId || !categoryId || !title || !adminId || !Array.isArray(required_documents) || required_documents.length === 0) {
            return res.status(400).json({
                message: "Required fields are missing",
            })
        }

        let admin = await adminModel.findById(adminId);

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            })
        }

        let template = await templateModel.findById(templateId);

        if (!template) {
            return res.status(404).json({
                message: "Template not found"
            })
        }
        title = title.trim();
        required_documents = required_documents.map(item => item.trim()).filter(item => item !== "");

        const uniqueDocuments = new Set(required_documents);

        if (uniqueDocuments.size !== required_documents.length) {
            return res.status(400).json({
                message: "Duplicate required documents are not allowed",
            });
        }

        // Check duplicate title (excluding current template)
        const existingTemplate = await templateModel.findOne({
            adminId,
            title,
            _id: { $ne: templateId },
        });

        if (existingTemplate) {
            return res.status(409).json({
                message: "Template title already exists",
            });
        }

        const updatedTemplate = await templateModel.findByIdAndUpdate(
            templateId,
            {
                categoryId,
                title,
                required_documents,
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Template updated successfully",
            data: updatedTemplate,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const getTemplateById = async (req, res) => {
    try {
        let { templateId } = req.body;

        if (!templateId) {
            return res.status(400).json({
                message: "templateId is required"
            })
        }

        let template = await templateModel.findById(templateId).populate("categoryId", "name");
;

        if (!template) {
            return res.status(404).json({
                message: "template not found"
            })
        }

        return res.status(200).json({
            message: "template found successfully",
            data: template
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const getAllTemplates = async (req, res) => {
    try {
        let { adminId } = req.body;

        if (!adminId) {
            return res.status(400).json({
                message: "adminId is required"
            })
        }

        let admin = await adminModel.findById(adminId);

        if (!admin) {
            return res.status(404).json({
                message: "admin not found",
            })
        }

        const template = await templateModel.find({ adminId }).populate("categoryId", "name");

        if (template.length === 0) {
            return res.status(404).json({
                message: "No templates found for this admin.",
            });
        }

        return res.status(200).json({
            message: "Templates fetched successfully",
            data: template,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const deleteTemplateById = async (req, res) => {
    try {
        const { templateId, adminId } = req.body

        if (!templateId || !adminId) {
            return res.status(400).json({
                message: "templateId and adminId is required"
            })
        }

        let admin = await adminModel.findById(adminId);

        if (!admin) {
            return res.status(404).json({
                message: "admin not found",
            })
        }

        const template = await templateModel.findOne({ _id: templateId, adminId });

        if (!template) {
            return res.status(404).json({
                message: "No template found "
            })
        }
        await template.deleteOne();

        return res.status(200).json({
            message: "Template deleted successfully.",
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const deleteAllTemplate = async(req,res) => {
    try{
        const {adminId} = req.body;

        if(!adminId){
            return res.status(400).json({
                message:"adminId is required"
            })
        }

        const admin = await adminModel.findById(adminId);

        if(!admin){
             return res.status(404).json({
                message:"admin not found"
            })
        }

        const template = await templateModel.deleteMany({adminId});

        if(template.deletedCount === 0){
             return res.status(404).json({
             message: "No templates found for this admin.",
            });
        }

        return res.status(200).json({
            message: "All templates deleted successfully.",
            deletedCount: template.deletedCount,
        });

    }catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export {
    createTemplate,
    getAllTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplateById,
    deleteAllTemplate,
};


