import React, { useEffect, useState } from "react";
import {
  FiFolder,
  FiArrowLeft,
  FiInfo,
  FiSave,
} from "react-icons/fi";

import "./UpdateCategory.css";
import apiCat from "../../services/cateService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateCategory = () => {

    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error,setError] = useState({});
    const {categoryId} = useParams();
    function getCategoryData(){
        apiCat.get(`/get/${categoryId}`).then((res) => {
            if(res.status === 200){
                const json = res.data.data;
                setName(json.name);
                setDescription(json.description)
            }
        })
    }




  useEffect(() => {
        getCategoryData()
  }, [categoryId]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    const newError = {}

        if (name.trim().length === 0) {
            newError.name = "Name is required"
        } else if (name.trim().length < 3) {
            newError.name = "Name length at least 3"
        } else if (description.trim().length > 0 && description.trim().length < 10) {
            newError.description = "Description must be at least 10 characters";
        }

        setError(newError);

        if (Object.keys(newError).length > 0) return

        try{

            const res = await apiCat.put("/update",{
                categoryId,
                name,
                description
            })

            toast.success(res?.data?.message || "Category update successfully");

            setName("");
            setDescription("");
            
            setTimeout(() => {
                navigate("/categories");
            },1000);

        }catch(error){
            toast.error(
                error.response.data.error || "Something wnat wrong"
            )
        }

  };

  return (
    <div className="update-category-page">

      {/* Breadcrumb */}

      <div className="uc-breadcrumb">
        <span>Categories</span>
        <span>/</span>
        <span>Update Category</span>
      </div>

      {/* Header */}

      <div className="uc-header-card">

        <div className="uc-header-left">

          <div className="uc-icon-box">
            <FiFolder />
          </div>

          <div>
            <h2>Update Category</h2>

            <p>
              Update your category information and description.
            </p>
          </div>

        </div>

        <button className="uc-back-btn">
          <FiArrowLeft />
          Back to Categories
        </button>

      </div>

      {/* Form */}

      <form
        className="uc-form-card"
        onSubmit={handleSubmit}
      >

        <div className="uc-title">

          <h3>
            Category Information
            <FiInfo />
          </h3>

          <p>
            Update the details of this category.
          </p>

        </div>

        <div className="uc-group">

          <label>
            Category Name <span>*</span>
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error.name && <small className="error-text">{error.name}</small>}

        </div>

        <div className="uc-group">

          <label>Description (Optional)</label>

          <textarea
            rows={6}
            name="description"
            placeholder="Enter category description..."
            value={description}
            maxLength={500}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="uc-description-footer">
    {error.description && <small className="error-text">{error.description}</small>}
          </div>

        </div>

        <div className="uc-footer">

          <button
            type="button"
            className="uc-cancel-btn"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="uc-save-btn"
          >
            <FiSave />
            Update Category
          </button>

        </div>

      </form>

    </div>
  );
};

export default UpdateCategory;