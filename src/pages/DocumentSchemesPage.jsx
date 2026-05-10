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
import React from "react";
import { useLocation } from "react-router-dom";

const DocumentSchemesPage = () => {

  const location = useLocation();

  const schemes = location.state?.schemes || [];

  return (

    <div
      style={{
        padding: "40px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh"
      }}
    >

      <h1
        style={{
          textAlign: "center",
          marginBottom: "10px",
          color: "#333"
        }}
      >
        Your Eligible Government Schemes
      </h1>

      <p
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "#666"
        }}
      >
        Based on your uploaded document
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
                marginBottom: "15px"
              }}
            >
              {scheme.scheme_name}
            </h2>

            <p
              style={{
                color: "#666",
                marginBottom: "20px"
              }}
            >
              {scheme.description}
            </p>

            <h3
              style={{
                marginBottom: "10px"
              }}
            >
              Required Documents:
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

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px"
              }}
            >

              {(scheme.tags || []).map((tag, i) => (

                <span
                  key={i}
                  style={{
                    backgroundColor: "#eee",
                    padding: "5px 10px",
                    borderRadius: "10px",
                    fontSize: "12px"
                  }}
                >
                  {tag}
                </span>

              ))}

            </div>

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
                cursor: "pointer"
              }}
            >
              Apply Now →
            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default DocumentSchemesPage;