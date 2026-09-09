import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";
import { installTestingAccessHeader } from "./lib/testingAccess";
import { initTranslation } from "./utils/translationService";

installTestingAccessHeader();
initTranslation();

ReactDOM.createRoot(document.getElementById("root")).render(
<React.StrictMode>
<App />
</React.StrictMode>
);
