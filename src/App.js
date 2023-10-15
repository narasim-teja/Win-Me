import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import PlayMe from "./PlayMe";
import Buy from "./Buy";
import Select from "./Select";

const App = () => {
    const [importedData, setImportedData] = useState(null);

    // Callback function to receive imported data from Select
    const handleImportedData = (data) => {
        console.log("not yet");
        setImportedData(data);
        console.log("setImportedData", data);
    };

    return (
        <>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buy" element={<Buy />} />
    
            {/* Pass imported data to PlayMe */}
            <Route
              path="/play-me"
              element={<PlayMe importedData={importedData}/>}
            />
    
            {/* Render Select component and provide the callback */}
            <Route
              path="/import"
              element={<Select onFileUpload={handleImportedData} />}
            />
          </Routes>
        </>
      );

}

export default App;