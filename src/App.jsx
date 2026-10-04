import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Weather from "./pages/Weather";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/components.css";

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
