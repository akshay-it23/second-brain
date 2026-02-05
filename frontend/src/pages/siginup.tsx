
import { Link } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import bak from '../assets/bak.png'
import logo from '../assets/Logo.png'; 
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
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Signup Error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Signup failed! Try again.";
      const errorCode = error.response?.data?.code;
      console.error("Error details:", {
        message: errorMessage,
        code: errorCode,
        status: error.response?.status,
        data: error.response?.data
      });
      toast.error(`❌ ${errorMessage}`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
    
         <img 
                src={bak} 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover z-0" 
            />  <ToastContainer />
            
      <div className=" rounded-lg border shadow-sm min-w-[320px] p-6 relative z-10"><div className="fixed top-0 left-0 w-full flex gap-7 justify-between items-start m-0 p-0 z-50">
  {/* Logo */}
  <img 
    src={logo} 
    alt="Brainstrom Logo" 
    className="w-40 sm:w-52 cursor-pointer select-none m-0 p-0" 
    onClick={() => navigate('/')} 
  />

  {/* Buttons */}
  <div className="flex gap-5 m-2 p-2 items-start">
    <Button 
      variant="primary" 
      color="white" 
      size="lg"  
      text="Login" 
      onClick={() => navigate('/login')} 
    />
    <Button 
      variant="primary" 
      color="black" 
      size="lg"   
      text="SignUp" 
      onClick={() => navigate('/signup')} 
    />
  </div>
</div>
      <div className=" flex flex-col  items-center text-white mb-5 text-xl ">
         Welcome to BrainStrom
    
         <div className='text-blue-400 text-sm'>
                            <span className='font-bold'>Create account</span> to sync your mind and ideas effortlessly
                        </div></div>

       <div className="flex flex-col  items-center justify-center ">
  <Input
    ref={usernameRef}
    placeholder="Username"
   
    className="w-80 h-12 text-lg placeholder:text-center"
  />
  
  <div className=" mt-4 w-0 flex flex-col items-center justify-center">
    <Input
      ref={passwordRef}
      placeholder="Password"

      className=" w-80 h-12 text-lg placeholder:text-center"
    />
  </div>
</div>
        <div className="flex justify-center pt-4">
         <Button
  variant="primary"
  text={loading ? "Loading..." : "Signup"}
  onClick={signup}
  disabled={loading}
/>

        </div>
          <p className="text-sm text-center mt-4  text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
