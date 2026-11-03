import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import "./styles/index.css";
import { QueryProvider } from "./lib/providers/QueryProvider.jsx";

createRoot(document.getElementById("root")).render(
  <QueryProvider>
    <App />
  </QueryProvider>,
);
