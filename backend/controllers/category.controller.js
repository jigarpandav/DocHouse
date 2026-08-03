import categoryModel from "../models/category.model.js";
import adminModel from "../models/admin.model.js";
import CategoryModel from "../models/category.model.js";
import templateModel from "../models/template.model.js"

const createCategory = async (req,res) => {
    try{
        console.log(req.body)
        const {adminId,name,description} = req.body;

        if(!adminId || !name){
            return res.status(400).json({
                message:"adminId & name is required"
            })
        }

        const admin = await adminModel.findById(adminId);

        if(!admin){
            return res.status(404).json({
                message:"admin not found"
            })
        }

        const existingCategory = await categoryModel.findOne({adminId,name});

            if(existingCategory){
                return res.status(409).json({
                    message:"category already existing"
                })
            }
        
            const category = await categoryModel.create({
                adminId,
                name,
                description
            })
             return res.status(201).json({
                message:"category create successfully"
             })

    }catch(err){
        console.log(err);

        return res.status(500).json({
            message:"Internal server error"
        })
    }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryId, name, description } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }

    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Check duplicate name (excluding current category)
    if (name) {
      const existingCategory = await categoryModel.findOne({
        _id: { $ne: categoryId },
        adminId: category.adminId,
        name: name.trim(),
      });

      if (existingCategory) {
        return res.status(409).json({
          message: "Category already exists",
        });
      }
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      categoryId,
      {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description }),
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    let {
      adminId,
      search = "",
      page = 1,
      limit = 10,
    } = req.body;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    const skip = (page - 1) * limit;

    if (!adminId) {
      return res.status(400).json({
        message: "Admin ID is required",
      });
    }

    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // Search Query
    const filter = {
      adminId,
      ...(search && {
        name: {
          $regex: search,
          $options: "i",
        },
      }),
    };

    // Total Count
    const totalCategories = await categoryModel.countDocuments(filter);

    // Data
    const categories = await categoryModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (categories.length === 0) {
      return res.status(404).json({
        message: "No categories found.",
      });
    }

    return res.status(200).json({
      message: "Categories fetched successfully",

      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCategories / limit),
        totalRecords: totalCategories,
        limit,
      },

      data: categories,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const getCategoryById = async (req,res) => {
    try{
        const { categoryId } = req.params;

        
    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }

    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
        message: " Category fetched successfully",
        data: category
    })

    }catch(error){
        console.log(error);

        return res.status(500).json({
            message: "Internal resver error"
        })
    }
}


const deleteCategory = async (req,res) => {
  try{
        const { categoryId } = req.params;

        
    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }

    const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

  await templateModel.deleteMany({
  categoryId: categoryId,
});



    return res.status(200).json({
        message: " Category and related templates deleted successfully",
        data: deletedCategory,
    })

    }catch(error){
        console.log(error);

        return res.status(500).json({
            message: "Internal resver error"
        })
    }
}


const deleteAllCategory = async (req,res) => {
    try{

        const  { adminId } = req.body;

        if(!adminId){
            return  res.status(400).json({
                message: "adminId is required"
            })
        }

        const admin = await adminModel.findById(adminId);

        if(!admin){
            return res.status(404).json({
                message: "Admin not found"
            })
        }

        const categories = await categoryModel.find({adminId});

        if(categories.length === 0){
            return res.status(404).json({
                message: "No category found for this admin."
            })
        }

       await categoryModel.deleteMany({adminId});

       await templateModel.deleteMany({ adminId: adminId });

        return res.status(200).json({
            message:"All categories deleted successfully."
        })

    }catch(error){
        console.log(error);

        return res.status(500).json({
            message: "Internal resver error"
        })
    }
}

export {createCategory,updateCategory,getAllCategory,getCategoryById,deleteAllCategory,deleteCategory}