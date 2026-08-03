import React from "react";
import Spinner from "react-bootstrap/Spinner";

const Loader = () => {

    return (

        <div className="d-flex justify-content-center align-items-center py-5">

            <Spinner
                animation="border"
                variant="primary"
            />

        </div>

    );

};

export default Loader;