import React from "react";
import Form from "react-bootstrap/Form";

const SearchBar = ({
    value,
    onChange,
    placeholder = "Search...",
}) => {

    return (

        <Form.Control
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />

    );

};

export default SearchBar;