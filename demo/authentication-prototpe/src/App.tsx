// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AuthCallback from "./AuthCallback";

function App() {
  return (
    <BrowserRouter>
      {/* 以下の Routes の中で「どのURLに、どの画面を出すか」をまとめて定義しています */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* /api/auth/callback にアクセスが来たら AuthCallback の画面を通す */}
        <Route path="/api/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
