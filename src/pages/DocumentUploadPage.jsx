import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./DocumentUploadPage.css";

const DocumentUploadPage = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  

  const handleUpload = async () => {

    try {

      if (!selectedFile) {
        setError("Please select a file");
        return;
      }

      setLoading(true);
      setError("");

     

      const uniqueFileName =
        `${Date.now()}-${selectedFile.name}`;


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

     

      await new Promise((resolve) =>
        setTimeout(resolve, 5000)
      );

      

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


      if (!response.ok) {

        const errorText =
          await response.text();

        console.log("API ERROR:", errorText);

        throw new Error(errorText);
      }

      

      const result = await response.json();

      console.log("FULL RESPONSE:", result);

     
      const parsedData =
        typeof result.body === "string"
          ? JSON.parse(result.body)
          : result.body;

      console.log("PARSED DATA:", parsedData);

      

      let matchedSchemes = [];

      if (Array.isArray(parsedData?.eligibleSchemes)) {

        matchedSchemes =
          parsedData.eligibleSchemes;

      }

      else if (
        parsedData?.body &&
        typeof parsedData.body === "string"
      ) {

        const bodyData =
          JSON.parse(parsedData.body);

        matchedSchemes =
          bodyData.eligibleSchemes || [];

      }

      console.log(
        "FINAL MATCHED SCHEMES:",
        matchedSchemes
      );


      matchedSchemes = matchedSchemes.map((scheme) => {

        let website =
          "https://www.india.gov.in/my-government/schemes";

        if (
          scheme.scheme_name
            ?.toLowerCase()
            .includes("ayushman")
        ) {

          website = "https://pmjay.gov.in/";

        }

        else if (
          scheme.scheme_name
            ?.toLowerCase()
            .includes("scholarship")
        ) {

          website =
            "https://scholarships.gov.in/";

        }

        else if (
          scheme.scheme_name
            ?.toLowerCase()
            .includes("jan dhan")
        ) {

          website = "https://pmjdy.gov.in/";

        }

        else if (
          scheme.scheme_name
            ?.toLowerCase()
            .includes("beti bachao")
        ) {

          website =
            "https://wcd.nic.in/bbbp-schemes";

        }

        else if (
          scheme.scheme_name
            ?.toLowerCase()
            .includes("kanya")
        ) {

          website =
            "https://mksy.up.gov.in/women_welfare/index.php";

        }

        return {

          ...scheme,

          required_documents:

            scheme.required_documents?.filter(
              (doc) =>
                doc &&
                doc.toString().trim() !== ""
            )?.length > 0

              ? scheme.required_documents

              : [
                  "Aadhaar Card",
                  "Income Certificate",
                  "Bank Passbook"
                ],

          website
        };

      });

      console.log(
        "FINAL MATCHED SCHEMES:",
        matchedSchemes
      );

      

      localStorage.setItem(

        "documentSchemes",

        JSON.stringify(matchedSchemes)
      );

      navigate("/document-schemes", {
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

    <motion.div
      className="document-upload-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >

      <motion.div
        className="document-upload-card"
        initial={{
          y: 40,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          duration: 0.7
        }}
      >

        <motion.h1
          className="document-upload-title"
          initial={{
            scale: 0.9,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          transition={{
            duration: 0.6
          }}
        >
          📄 Document Upload Page
        </motion.h1>

        <motion.p
          className="document-upload-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.3
          }}
        >
          Upload Aadhaar document to find eligible schemes
        </motion.p>

        <input
          type="file"
          onChange={handleFileChange}
          className="document-upload-input"
        />

        <br />

        <motion.button
          whileHover={{
            scale: 1.05
          }}
          whileTap={{
            scale: 0.95
          }}
          onClick={handleUpload}
          disabled={loading}
          className="document-upload-button"
        >

          {loading ? (

            <div className="loader"></div>

          ) : (

            "Upload & Find Schemes"

          )}

        </motion.button>

        {error && (
          <p className="document-upload-error">
            {error}
          </p>
        )}

      </motion.div>

    </motion.div>
  );
};

export default DocumentUploadPage;
