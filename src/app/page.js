// "use client";

// import React, { useState } from "react";
// import SearchBar from "@/components/SearchBar";
// import ResultCard from "@/components/ResultCard";

// export default function Page() {
//   // 🔹 State that holds the search result
//   const [resultData, setResultData] = useState(null);

//   return (
//     <div className="flex flex-col items-center p-6">
//       {/* ✅ Pass the callback so SearchBar can send result data */}
//       <SearchBar onResult={setResultData} />

//       {/* ✅ Conditionally render the card when data is available */}
//       {resultData && (
//         <div className="mt-6 w-full flex justify-center">
//           <ResultCard
//             state={resultData.state}
//             district={resultData.district}
//             year={resultData.year}
//             result={resultData.result}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResultCard from "@/components/ResultCard";

export default function Page() {
  const [searchResult, setSearchResult] = useState(null);

  return (
    <div className="flex flex-col bg-white items-center p-6">
      {/* ✅ Pass the callback */}
      <SearchBar onResult={setSearchResult} />

      {/* ✅ Conditionally show ResultCard */}
      {searchResult && (
        <div className="mt-6 w-full flex justify-center">
          <ResultCard
            state={searchResult.state}
            district={searchResult.district}
            year={searchResult.year}
            result={searchResult.result}
          />
        </div>
      )}
    </div>
  );
}
