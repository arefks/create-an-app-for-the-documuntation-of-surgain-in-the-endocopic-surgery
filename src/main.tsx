import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>ReportPilot (Dev Build)</h1>
      <p>This is the Vite dev/production React entry point.</p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
