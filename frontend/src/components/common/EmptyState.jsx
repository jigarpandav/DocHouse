import React from "react";
import { Card } from "react-bootstrap";

const EmptyState = ({
    title = "No Data Found",
    description = "There is nothing to display.",
}) => {

    return (

        <Card className="text-center p-5">

            <h4>{title}</h4>

            <p className="text-muted">
                {description}
            </p>

        </Card>

    );

};

export default EmptyState;