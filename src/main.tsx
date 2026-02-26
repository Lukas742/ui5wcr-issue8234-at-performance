import "@ui5/webcomponents-react/dist/Assets.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./global.css";
import AnalyticalSample from "./AnalyticalSample.tsx";
import { ThemeProvider } from "@ui5/webcomponents-react/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ThemeProvider>
    <AnalyticalSample />
  </ThemeProvider>,
  // </StrictMode>
);
