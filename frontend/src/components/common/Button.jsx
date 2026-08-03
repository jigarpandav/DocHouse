import React from "react";
import Button from "react-bootstrap/Button";

const CustomButton = ({
    title,
    onClick,
    variant = "primary",
    type = "button",
    disabled = false,
    loading = false,
    className = "",
}) => {
    return (
        <Button
            type={type}
            variant={variant}
            onClick={onClick}
            disabled={disabled || loading}
            className={className}
        >
            {loading ? "Please Wait..." : title}
        </Button>
    );
};

export default CustomButton;

{/* <CustomButton
    title="Save"
    variant="primary"
/> */}