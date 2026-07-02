import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { framer } from "framer-plugin";
import { App } from "./App";
import "framer-plugin/framer.css";

void framer.showUI({ position: "top right", width: 340, height: 520 });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
