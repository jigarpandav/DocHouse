import React, { useState } from "react";
import {
    FiFolder,
    FiArrowLeft,
    FiInfo,
    FiSave,
} from "react-icons/fi";
import "./CreateCategory.css";
import apiCat from "../../services/cateService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {

    const adminId = localStorage.getItem("adminId");
    const navigate = useNavigate()

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newError = {};

        if (name.trim().length === 0) {
            newError.name = "Name is required"
        } else if (name.trim().length < 3) {
            newError.name = "Name length at least 3"
        } else if (description.trim().length > 0 && description.trim().length < 10) {
            newError.description = "Description must be at least 10 characters";
        }

        setError(newError);

        if (Object.keys(newError).length > 0) return

        try {
            setLoading(true);
            const res = await apiCat.post("/create", {
                adminId,
                name,
                description
            })

            toast.success(res?.data?.message || "Category create successfully")


            setName("");
            setDescription("");
            setError({});

            setTimeout(() => {
                navigate("/categories")
            },1000)
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="create-category-page">

            {/* Breadcrumb */}

            <div className="cc-breadcrumb">
                <span>Categories</span>
                <span>/</span>
                <span>Create Category</span>
            </div>

            {/* Header */}

            <div className="cc-header-card">

                <div className="cc-header-left">

                    <div className="cc-icon-box">
                        <FiFolder />
                    </div>

                    <div>
                        <h2>Create Category</h2>

                        <p>
                            Create a new category to organize your templates and documents
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    className="cc-back-btn"
                    onClick={() => navigate("/categories")}
                >
                    <FiArrowLeft />
                    Back to Categories
                </button>

            </div>

            {/* Form */}

            <form
                className="cc-form-card"
                onSubmit={handleSubmit}
            >

                <div className="cc-title">

                    <h3>
                        Category Information
                        <FiInfo />
                    </h3>

                    <p>
                        Fill in the details below to create a new category.
                    </p>

                </div>

                <div className="cc-group">

                    <label>
                        Category Name <span>*</span>
                    </label>

                    <input
                        type="text"
                        value={name}
                        minLength={3}
                        maxLength={50}
                        required
                        placeholder="Enter category name"
                        onChange={(e) => setName(e.target.value)}
                    />

                    {error.name && <small className="text-error">{error.name}</small>}

                </div>

                <div className="cc-group">

                    <label>Description (Optional)</label>

                    <textarea
                        rows={6}
                        maxLength={500}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter category description..."
                    />

                    <div className="cc-description-footer">

                        <small>
                            Provide a brief description about this category
                        </small>

                        <span>
                            {description.length}/500
                        </span>

                    </div>
                    {error.description && <small className="text-error">{error.description}</small>}

                </div>

                <div className="cc-footer">

                    <button
                        className="cc-back-btn"
                        onClick={() => navigate("/categories")}
                    >
                        <FiArrowLeft />
                        Back to Categories
                    </button>

                    <button
                        type="submit"
                        className="cc-save-btn"
                        disabled={loading}
                    >
                        <FiSave />
                        {loading ? "Creating..." : "Create Category"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default CreateCategory;