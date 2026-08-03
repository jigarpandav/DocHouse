import React from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";

const CustomBreadcrumb = ({
    items = [],
}) => {

    return (

        <Breadcrumb>

            {items.map((item, index) => (

                <Breadcrumb.Item
                    key={index}
                    active={item.active}
                    href={item.href}
                >
                    {item.label}
                </Breadcrumb.Item>

            ))}

        </Breadcrumb>

    );

};

export default CustomBreadcrumb;