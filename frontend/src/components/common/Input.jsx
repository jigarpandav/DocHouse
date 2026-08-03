import React from "react";
import Form from "react-bootstrap/Form";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  readOnly = false,   // ✅ ADD THIS
}) => {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}

      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        required={required}
        onChange={onChange}
        readOnly={readOnly}   // ✅ ADD THIS
      />
    </Form.Group>
  );
};

export default Input;

{/* <Input
label="Title"
placeholder="Enter Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/> */}