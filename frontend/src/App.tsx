
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup } from "./pages/siginup";
import { Signin } from "./pages/signin";
import { Dashboard } from "./pages/dashboard";
import { Landing } from "./pages/landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
