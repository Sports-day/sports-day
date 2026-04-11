console.log("[form] main.tsx loaded")
import "@fontsource/noto-sans-jp/400.css"
import "@fontsource/noto-sans-jp/500.css"
import "@fontsource/noto-sans-jp/600.css"
import "@fontsource/noto-sans-jp/700.css"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
