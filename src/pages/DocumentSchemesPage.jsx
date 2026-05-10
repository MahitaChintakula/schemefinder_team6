import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const DocumentSchemesPage = () => {
  const location = useLocation();

  const schemes =
    location.state?.schemes ||
    JSON.parse(localStorage.getItem("documentSchemes")) ||
    [];

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");

    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "te" : "en";

    setLanguage(newLanguage);

    localStorage.setItem("language", newLanguage);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "40px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleLanguage}
          style={{
            padding: "10px 18px",
            borderRadius: "20px",
            border: "1px solid #0d3b66",
            backgroundColor: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {language === "en" ? "తెలుగు" : "English"}
        </motion.button>
      </div>

      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{
          textAlign: "center",
          marginBottom: "10px",
          color: "#333",
          lineHeight: "1.5",
        }}
      >
        {language === "en"
          ? "Your Eligible Government Schemes"
          : "మీకు అర్హమైన ప్రభుత్వ పథకాలు"}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "#666",
          lineHeight: "1.8",
        }}
      >
        {language === "en"
          ? "Based on your uploaded document"
          : "మీరు అప్లోడ్ చేసిన డాక్యుమెంట్ ఆధారంగా"}
      </motion.p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "30px",
        }}
      >
        {schemes &&
        schemes.length > 0 &&
        schemes[0]?.scheme_name !== "No eligible schemes found" ? (
          schemes.map((scheme, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: [0, -5, 0],
              }}
              transition={{
                opacity: {
                  duration: 0.5,
                  delay: index * 0.1,
                },
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
              }}
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "25px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  color: "#0d3b66",
                  marginBottom: "15px",
                  lineHeight: "1.5",
                }}
              >
                {language === "en"
                  ? scheme.scheme_name
                  : scheme.scheme_name === "Ayushman Bharat Yojana"
                  ? "ఆయుష్మాన్ భారత్ యోజన"
                  : scheme.scheme_name ===
                    "National Means Cum Merit Scholarship"
                  ? "జాతీయ ప్రతిభా విద్యార్థి వేతన పథకం"
                  : scheme.scheme_name === "Kanya Sumangala Yojana"
                  ? "కన్యా సుమంగళ యోజన"
                  : scheme.scheme_name === "Beti Bachao Beti Padhao"
                  ? "బేటీ బచావో బేటీ పడావో"
                  : scheme.scheme_name ===
                    "Pradhan Mantri Jan Dhan Yojana"
                  ? "ప్రధాన మంత్రి జన ధన్ యోజన"
                  : scheme.scheme_name === "Balika Samridhi Yojana"
                  ? "బాలికా సమృద్ధి యోజన"
                  : scheme.scheme_name}
              </h2>

              <p
                style={{
                  color: "#666",
                  marginBottom: "20px",
                  lineHeight: "1.7",
                }}
              >
                {scheme.description}
              </p>

              <h3
                style={{
                  marginBottom: "10px",
                  lineHeight: "1.6",
                }}
              >
                {language === "en"
                  ? "Required Documents:"
                  : "అవసరమైన పత్రాలు:"}
              </h3>

              <ul
                style={{
                  paddingLeft: "20px",
                  color: "#444",
                  lineHeight: "1.8",
                }}
              >
                {(scheme.required_documents || [])
                  .filter(
                    (doc) => doc && doc.toString().trim() !== ""
                  )
                  .map((doc, i) => (
                    <li key={i}>
                      {typeof doc === "string"
                        ? doc
                        : doc.name || JSON.stringify(doc)}
                    </li>
                  ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.open(
                    scheme.website ||
                      "https://www.india.gov.in/my-government/schemes",
                    "_blank"
                  );
                }}
                style={{
                  marginTop: "20px",
                  background:
                    "linear-gradient(to right, #0f4c75, #f08a24)",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  lineHeight: "1.5",
                }}
              >
                {language === "en"
                  ? "Apply Now →"
                  : "ఇప్పుడే దరఖాస్తు చేయండి →"}
              </motion.button>
            </motion.div>
          ))
        ) : (
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "20px",
              textAlign: "center",
              width: "100%",
            }}
          >
            <h2
              style={{
                color: "#0d3b66",
              }}
            >
              {language === "en"
                ? "No schemes found"
                : "పథకాలు కనుగొనబడలేదు"}
            </h2>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DocumentSchemesPage;
