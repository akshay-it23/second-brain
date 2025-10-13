import { Link } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function signin() {
    setLoading(true);
    try {
      const username = usernameRef.current?.value || "";
      const password = passwordRef.current?.value || "";

      // ✅ You forgot to store the response in a variable
      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password,
      });

      console.log("Signin Response:", response.data);

      const jwt = response.data.token;
      if (jwt) {
        localStorage.setItem("token", jwt);

        toast.success(" You signed in successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        // Navigate after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        toast.error(" Signin failed! Token missing.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("❌ Invalid username or password!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("❌ Signin failed! Try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <ToastContainer /> 
      <div className="bg-white rounded-lg border shadow-sm min-w-[320px] p-6">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
          Sign in
        </h2>

        <Input ref={usernameRef} placeholder="Username" />
        <div className="mt-4">
          <Input
            ref={passwordRef}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
          />
        </div>

        <div className="flex justify-center pt-4">
          <Button
            variant="primary"
            text={loading ? "Loading..." : "Sign in"}
            fullWidth
            onClick={signin}
            disabled={loading}
          />
        </div>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
