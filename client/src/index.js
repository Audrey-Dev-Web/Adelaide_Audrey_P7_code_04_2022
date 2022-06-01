import React from "react";
import ReactDOM from "react-dom/client";
import "./sass/App.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CookiesProvider } from "react-cookie";
import ErrorBoundary from "./components/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <CookiesProvider>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </CookiesProvider>
    </React.StrictMode>
);

reportWebVitals();
