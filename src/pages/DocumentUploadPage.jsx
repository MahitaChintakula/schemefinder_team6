import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DocumentUploadPage = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =====================================
  // HANDLE FILE SELECT
  // =====================================

  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  // =====================================
  // UPLOAD FILE + FIND SCHEMES
  // =====================================

  const handleUpload = async () => {

    try {

      if (!selectedFile) {
        setError("Please select a file");
        return;
      }

      setLoading(true);
      setError("");

      // =====================================
      // GENERATE UNIQUE FILE NAME
      // =====================================

      const uniqueFileName =
        `${Date.now()}-${selectedFile.name}`;

      // =====================================
      // UPLOAD DIRECTLY TO S3
      // =====================================

      const uploadResponse = await fetch(

        `https://schemefinder-documents.s3.ap-south-1.amazonaws.com/${uniqueFileName}`,

        {
          method: "PUT",

          headers: {
            "Content-Type": selectedFile.type
          },

          body: selectedFile
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("S3 upload failed");
      }

      console.log("File uploaded to S3");

      // =====================================
      // CALL ELIGIBILITY LAMBDA
      // =====================================

      const response = await fetch(

        "https://wingjgs294.execute-api.ap-south-1.amazonaws.com/prod/upload-document",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            type: "document",

            bucket_name: "schemefinder-documents",

            file_name: uniqueFileName

          })
        }
      );

      // =====================================
      // HANDLE API ERRORS
      // =====================================

      if (!response.ok) {

        const errorText = await response.text();

        console.log("API ERROR:", errorText);

        throw new Error(errorText);
      }

      // =====================================
      // GET RESPONSE
      // =====================================

      const data = await response.json();

      console.log("FULL RESPONSE:", data);

      // =====================================
      // PARSE RESPONSE BODY
      // =====================================

      const parsedBody = JSON.parse(data.body);

      console.log("PARSED BODY:", parsedBody);

      // =====================================
      // GET MATCHED SCHEMES
      // =====================================

      const matchedSchemes =
        parsedBody.matchedSchemes || parsedBody;

      console.log("MATCHED SCHEMES:", matchedSchemes);

      // =====================================
      // REDIRECT TO ELIGIBILITY PAGE
      // =====================================

      navigate("/eligibility-schemes", {
        state: {
          schemes: matchedSchemes
        }
      });

    } catch (err) {

      console.error("ERROR:", err);

      setError("Failed to process document");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      style={{
        padding: "100px",
        textAlign: "center",
        fontFamily: "Arial"
      }}
    >

      <h1>📄 Document Upload Page</h1>

      <p>
        Upload Aadhaar document to find eligible schemes
      </p>

      <br />

      {/* FILE INPUT */}

      <input
        type="file"
        onChange={handleFileChange}
      />

      <br /><br />

      {/* BUTTON */}

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >

        {loading
          ? "Processing..."
          : "Upload & Find Schemes"}

      </button>

      <br /><br />

      {/* ERROR */}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

    </div>
  );
};

export default DocumentUploadPage;