import React from "react";
import Form from "react-bootstrap/Form";

const Select = ({
    label,
    options = [],
    value,
    onChange,
    name,
}) => {
    return (
        <Form.Group className="mb-3">

            {label && <Form.Label>{label}</Form.Label>}

            <Form.Select
                value={value}
                onChange={onChange}
                name={name}
            >

                <option value="">Select</option>

                {options.map((item) => (

                    <option
                        key={item.value}
                        value={item.value}
                    >
                        {item.label}
                    </option>

                ))}

            </Form.Select>

        </Form.Group>
    );
};

export default Select;

{/* <Select
label="Status"
value={status}
onChange={(e)=>setStatus(e.target.value)}
options={[
    {
        value:true,
        label:"Active"
    },
    {
        value:false,
        label:"Inactive"
    }
]}
/> */}