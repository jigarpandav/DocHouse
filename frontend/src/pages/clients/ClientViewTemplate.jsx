import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { Link, useParams } from "react-router-dom";
import {
  FiCheck,
  FiPrinter,
  FiDownload,
  FiX,
} from "react-icons/fi";

import "./ClientViewTemplate.css";

import apiAuth from "../../services/authService";
import apiFirm from "../../services/firmService";
import apiTemp from "../../services/templateService";

const ClientViewTemplate = () => {

  const adminId = localStorage.getItem("adminId");
  const { templateId } = useParams();

  const IMGURL = import.meta.env.VITE_IMG_URL || `${window.location.origin}/uploads`;
  const getImageUrl = (fileName) =>
    fileName
      ? `${IMGURL.replace(/\/$/, "")}/${fileName}?v=${encodeURIComponent(fileName)}`
      : "";

  const [firmData, setFirmData] = useState({});
  const [adminEmail, setAdminEmail] = useState("");
  const [title, setTitle] = useState("");
  const [requireDoc, setRequireDoc] = useState([]);

  /* ===========================================================
      GET ADMIN
  =========================================================== */

  useEffect(() => {

    apiAuth.post("/get", {
      adminId,
    })
    .then((res) => {

      if (res.status === 200) {

        setAdminEmail(res.data.data.email);

      }

    });

  }, []);

  /* ===========================================================
      GET FIRM
  =========================================================== */

  useEffect(() => {

    apiFirm.post("/get", {
      adminId,
    })
    .then((res) => {

      if (res.status === 200) {

        setFirmData(res.data.data);

      }

    });

  }, [adminId]);

  /* ===========================================================
      GET TEMPLATE
  =========================================================== */

  useEffect(() => {

    apiTemp.post("/get", {
      templateId,
    })
    .then((res) => {

      if (res.status === 200) {

        const data = res.data.data;

        setTitle(data.title);
        setRequireDoc(data.required_documents || []);

      }

    });

  }, [templateId]);

  /* ===========================================================
      PRINT
  =========================================================== */

  const handlePrint = () => {

    window.print();

  };

  /* ===========================================================
      DOWNLOAD PDF
  =========================================================== */

const handleDownload = () => {

    const element = document.getElementById("pdf-sheet");

    html2pdf()
        .set({

            margin:0,

            filename:`${title}.pdf`,

            image:{
                type:"jpeg",
                quality:1
            },

            html2canvas:{
              scale:1,
                useCORS:true,
                scrollX:0,
                scrollY:0,
              backgroundColor:"#eef3fb",
                windowWidth:794,
                windowHeight:1123
            },

            pagebreak:{
              mode:["avoid-all"]
            },

            jsPDF:{
                unit:"mm",
                format:"a4",
                orientation:"portrait"
            }

        })
        .from(element)
        .save();

};

  /* ===========================================================
      DATA
  =========================================================== */

  const firm = {

    shopName:
      firmData?.shopName || "Document House",

    profession:
      firmData?.profession || "Advocate",

    logo:
      firmData?.logo,

    phone1:
      firmData?.primaryPhone,

    phone2:
      firmData?.secondaryPhone,

    email:
      adminEmail,

    address:
      firmData?.address,

  };

  const longestDocumentLength = requireDoc.reduce(
    (maxLength, doc) => Math.max(maxLength, String(doc || "").trim().length),
    0
  );

  let documentDensity = 0;

  if (requireDoc.length > 6 || longestDocumentLength > 24) {
    documentDensity = 1;
  }

  if (requireDoc.length > 9 || longestDocumentLength > 32) {
    documentDensity = 2;
  }

  if (requireDoc.length > 12 || longestDocumentLength > 40) {
    documentDensity = 3;
  }

  return (

    <div className="template-page">

      {/* =======================================================
            ACTION BUTTONS
      ======================================================= */}

      <div className="template-actions">

        <button
          className="print-btn"
          onClick={handlePrint}
        >
          <FiPrinter />
          Print
        </button>

        <button
          className="download-btn"
          onClick={handleDownload}
        >
          <FiDownload />
          Download PDF
        </button>

        <Link
          to="/client/view"
          className="theme-btn secondary-btn"
        >
          <FiX />
          Cancel
        </Link>

      </div>

      {/* =======================================================
            PDF PAGE
      ======================================================= */}

      <div
        className={`a4-sheet docs-density-${documentDensity}`}
        id="pdf-sheet"
      >
        {/* ===========================
        HEADER
=========================== */}

<div className="template-header">

  <div className="header-logo">

    {firm.logo ? (

      <img
        src={getImageUrl(firm.logo)}
        alt={firm.shopName}
      />

    ) : (

      <div className="logo-box">
        LAW
      </div>

    )}

  </div>

  <div className="header-details">

    <h1>{firm.shopName}</h1>

    <p>{firm.profession}</p>

  </div>

  <div className="header-contact">

    {firm.phone1 && <div>{firm.phone1}</div>}

    {firm.phone2 && <div>{firm.phone2}</div>}

    {firm.email && <div>{firm.email}</div>}

  </div>

</div>

{/* ===========================
        TITLE
=========================== */}

<div className="template-heading">

  <div className="heading-box">

    <h2>{title}</h2>

  </div>

</div>

{/* ===========================
        DOCUMENTS
=========================== */}

<div className="documents-section">

  <div className="documents-title">

    Required Documents

  </div>

  {requireDoc.length === 0 ? (

    <div className="empty-doc">

      No Required Documents

    </div>

  ) : (

    requireDoc.map((doc, index) => (

      <div
        className="document-item"
        key={index}
      >

        <div className="document-left">

          <div className="document-square" />

          <span>{doc}</span>

        </div>

        <div className="document-check">

          <FiCheck />

        </div>

      </div>

    ))

  )}

</div>



{/* ===========================
        FOOTER
=========================== */}

<div className="footer-section">

  <div className="footer-left">

    <div className="office-info">

      <h3>

        Office Address

      </h3>

      <p>

        {firm.address || "Address Not Available"}

      </p>

    </div>

    <div className="contact-info">

      {firm.phone1 && (

        <div className="contact-row">

          <span className="contact-label">

            Phone

          </span>

          <span>

            {firm.phone1}

          </span>

        </div>

      )}

      {firm.phone2 && (

        <div className="contact-row">

          <span className="contact-label">

            Mobile

          </span>

          <span>

            {firm.phone2}

          </span>

        </div>

      )}

      {firm.email && (

        <div className="contact-row">

          <span className="contact-label">

            Email

          </span>

          <span>

            {firm.email}

          </span>

        </div>

      )}

    </div>

  </div>

  <div className="footer-right">

    <div className="advocate-box">

      <div className="advocate-logo">

        {firm.logo ? (

          <img
            src={getImageUrl(firm.logo)}
            alt={firm.shopName}
          />

        ) : (

          <div className="advocate-placeholder">

            <FiCheck />

          </div>

        )}

      </div>

      <div className="advocate-info">

        <h2>

          {firm.shopName}

        </h2>

        <p>

          {firm.profession}

        </p>

        <span>

          Trust | Service | Quality

        </span>

      </div>

    </div>

  </div>

</div>

{/* ===========================
      BOTTOM RIBBON
=========================== */}

<div className="bottom-ribbon">

  <span>

    {firm.profession}

  </span>

</div>

</div>

</div>

);

};



export default ClientViewTemplate;
