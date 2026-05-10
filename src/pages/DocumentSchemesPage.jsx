// import React from "react";
// import { useLocation } from "react-router-dom";

// const DocumentSchemesPage = () => {

//   const location = useLocation();

//   console.log("LOCATION STATE:", location.state);

//   const schemes =
//     location.state?.schemes || [];

//   return (

//     <div
//       style={{
//         padding: "50px",
//         textAlign: "center",
//         fontFamily: "Arial"
//       }}
//     >

//       <h1>Eligible Schemes</h1>

//       {

//         schemes.length > 0 ? (

//           <div
//             style={{
//               maxWidth: "700px",
//               margin: "30px auto"
//             }}
//           >

//             {

//               schemes.map((scheme, index) => (

//                 <div
//                   key={index}
//                   style={{
//                     background: "#f3f4f6",
//                     padding: "20px",
//                     marginBottom: "20px",
//                     borderRadius: "10px"
//                   }}
//                 >

//                   <h3>{scheme}</h3>

//                 </div>

//               ))

//             }

//           </div>

//         ) : (

//           <p>No schemes found</p>

//         )

//       }

//     </div>

//   );
// };

// export default DocumentSchemesPage;
// import React from "react";
// import { useLocation } from "react-router-dom";

// const DocumentSchemesPage = () => {

//   const location = useLocation();

//   const schemes = location.state?.schemes || [];

//   return (

//     <div
//       style={{
//         padding: "40px",
//         backgroundColor: "#f5f5f5",
//         minHeight: "100vh"
//       }}
//     >

//       <h1
//         style={{
//           textAlign: "center",
//           marginBottom: "10px",
//           color: "#333"
//         }}
//       >
//         Your Eligible Government Schemes
//       </h1>

//       <p
//         style={{
//           textAlign: "center",
//           marginBottom: "40px",
//           color: "#666"
//         }}
//       >
//         Based on your uploaded document
//       </p>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
//           gap: "30px"
//         }}
//       >

//         {schemes.map((scheme, index) => (

//           <div
//             key={index}
//             style={{
//               backgroundColor: "white",
//               borderRadius: "20px",
//               padding: "25px",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
//             }}
//           >

//             <h2
//               style={{
//                 color: "#0d3b66",
//                 marginBottom: "15px"
//               }}
//             >
//               {scheme.scheme_name}
//             </h2>

//             <p
//               style={{
//                 color: "#666",
//                 marginBottom: "20px"
//               }}
//             >
//               {scheme.description}
//             </p>

//             <h3
//               style={{
//                 marginBottom: "10px"
//               }}
//             >
//               Required Documents:
//             </h3>

//             <ul>
//               {(scheme.required_documents || []).length > 0 ? (

//                 (scheme.required_documents || []).map((doc, i) => (
//                   <li key={i}>{doc}</li>
//                 ))

//               ) : (

//                 <li>No documents required</li>

//               )}
//             </ul>

//             <div
//               style={{
//                 marginTop: "15px",
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: "10px"
//               }}
//             >

//               {(scheme.tags || []).map((tag, i) => (

//                 <span
//                   key={i}
//                   style={{
//                     backgroundColor: "#eee",
//                     padding: "5px 10px",
//                     borderRadius: "10px",
//                     fontSize: "12px"
//                   }}
//                 >
//                   {tag}
//                 </span>

//               ))}

//             </div>

//             <button
//               onClick={() => {

//                 if (scheme.website) {
//                   window.open(
//                     scheme.website,
//                     "_blank"
//                   );
//                 }

//               }}
//               style={{
//                 marginTop: "20px",
//                 background:
//                   "linear-gradient(to right, #0f4c75, #f08a24)",
//                 color: "white",
//                 border: "none",
//                 padding: "10px 20px",
//                 borderRadius: "10px",
//                 cursor: "pointer"
//               }}
//             >
//               Apply Now →
//             </button>

//           </div>

//         ))}

//       </div>

//     </div>
//   );
// };

// export default DocumentSchemesPage;
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const DocumentSchemesPage = () => {

  const location = useLocation();

  const schemes = location.state?.schemes || [];

  const [language, setLanguage] = useState(

    localStorage.getItem("language") || "en"

  );

  useEffect(() => {

    const storedLanguage =
      localStorage.getItem("language");

    if (storedLanguage) {

      setLanguage(storedLanguage);

    }

  }, []);

  const toggleLanguage = () => {

    const newLanguage =

      language === "en"
        ? "te"
        : "en";

    setLanguage(newLanguage);

    localStorage.setItem(
      "language",
      newLanguage
    );

  };

  return (

    <div
      style={{
        padding: "40px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh"
      }}
    >

      {/* LANGUAGE BUTTON */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px"
        }}
      >

        <button
          onClick={toggleLanguage}
          style={{
            padding: "10px 18px",
            borderRadius: "20px",
            border: "1px solid #0d3b66",
            backgroundColor: "white",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {language === "en"
            ? "తెలుగు"
            : "English"}
        </button>

      </div>

      <h1
        style={{
          textAlign: "center",
          marginBottom: "10px",
          color: "#333",
          lineHeight: "1.5"
        }}
      >
        {language === "en"
          ? "Your Eligible Government Schemes"
          : "మీకు అర్హమైన ప్రభుత్వ పథకాలు"}
      </h1>

      <p
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "#666",
          lineHeight: "1.8"
        }}
      >
        {language === "en"
          ? "Based on your uploaded document"
          : "మీరు అప్లోడ్ చేసిన డాక్యుమెంట్ ఆధారంగా"}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "30px"
        }}
      >

        {schemes.map((scheme, index) => (

          <div
            key={index}
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "25px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
          >

            <h2
              style={{
                color: "#0d3b66",
                marginBottom: "15px",
                lineHeight: "1.5"
              }}
            >
              {language === "en"

                ? scheme.scheme_name

                : scheme.scheme_name ===
                  "Ayushman Bharat Yojana"

                ? "ఆయుష్మాన్ భారత్ యోజన"

                : scheme.scheme_name ===
                  "National Means Cum Merit Scholarship"

                ? "జాతీయ ప్రతిభా విద్యార్థి వేతన పథకం"

                : scheme.scheme_name ===
                  "Kanya Sumangala Yojana"

                ? "కన్యా సుమంగళ యోజన"

                : scheme.scheme_name ===
                  "Beti Bachao Beti Padhao"

                ? "బేటీ బచావో బేటీ పడావో"

                : scheme.scheme_name ===
                  "Pradhan Mantri Jan Dhan Yojana"

                ? "ప్రధాన మంత్రి జన ధన్ యోజన"

                : scheme.scheme_name ===
                  "Balika Samridhi Yojana"

                ? "బాలికా సమృద్ధి యోజన"

                : scheme.scheme_name}
            </h2>

            <p
              style={{
                color: "#666",
                marginBottom: "20px",
                lineHeight: "1.7"
              }}
            >
              {scheme.description}
            </p>

            <h3
              style={{
                marginBottom: "10px",
                lineHeight: "1.6"
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
                lineHeight: "1.8"
              }}
            >
              {(scheme.required_documents || [])
                .filter(
                  (doc) =>
                    doc &&
                    doc.toString().trim() !== ""
                )
                .length > 0 ? (

                (scheme.required_documents || [])
                  .filter(
                    (doc) =>
                      doc &&
                      doc.toString().trim() !== ""
                  )
                  .map((doc, i) => (
                    <li key={i}>
                      {typeof doc === "string"
                        ? doc
                        : doc.name || JSON.stringify(doc)}
                    </li>
                  ))

              ) : (

                <>
                  <li>Aadhaar Card</li>
                  <li>Income Certificate</li>
                  <li>Bank Passbook</li>
                </>

              )}
            </ul>

            <button
              onClick={() => {

                if (scheme.website) {

                  window.open(
                    scheme.website,
                    "_blank"
                  );

                } else {

                  window.open(
                    "https://www.india.gov.in/my-government/schemes",
                    "_blank"
                  );

                }

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
                lineHeight: "1.5"
              }}
            >
              {language === "en"
                ? "Apply Now →"
                : "ఇప్పుడే దరఖాస్తు చేయండి →"}
            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default DocumentSchemesPage;