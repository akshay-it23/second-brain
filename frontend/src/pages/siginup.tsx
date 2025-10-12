// 📁 File: src/pages/Signup.tsx

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function signup() {
    setLoading(true);
    try {
      const username = usernameRef.current?.value || "";
      const password = passwordRef.current?.value || "";

      await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        password,
      });

      toast.success("🎉 You signed up! Please login now.", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("❌ Signup failed! Try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <ToastContainer />
      <div className="bg-white rounded-lg border shadow-sm min-w-[320px] p-6">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
          Signup
        </h2>

        <Input ref={usernameRef} placeholder="Username" />
        <div className="mt-4">
          <Input ref={passwordRef} placeholder="Password" type="password" />
        </div>

        <div className="flex justify-center pt-4">
          <Button
            variant="primary"
            text={loading ? "Loading..." : "Signup"}
            fullWidth
            onClick={signup}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
