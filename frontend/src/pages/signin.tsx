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
    <div className=" relative h-screen w-screen bg-gray-100 flex justify-center items-center">
     <img 
                src={bak} 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover z-0" 
            />
      <ToastContainer /> 
      <div className="bg-gray rounded-lg border shadow-sm min-w-[320px] p-6 relative z-10">
    <div className="fixed top-0 left-0 w-full flex gap-7 justify-between items-start m-0 p-0 z-50">
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
                           <h1>Welcome to BrainStrom</h1> 
                        <div className='text-blue-400 text-sm'>
                            <span className='font-bold'>Log in</span> to sync your mind and ideas effortlessly
                        </div>
                    </div>

     <div className="flex flex-col items-center justify-center ">
  <Input
    ref={usernameRef}
    placeholder="Username"

    className="w-80 h-12 text-lg placeholder:text-center"
  />
  
  <div className=" mt-4 w-0 flex flex-col items-center justify-center">
    <Input
      ref={passwordRef}
      placeholder="Password"
      type={showPassword ? "text" : "password"}
      className=" w-80 h-12 text-lg placeholder:text-center"
    />
  </div>
</div>


        <div className="flex justify-center pt-4">
          <Button
            variant="primary"
            text={loading ? "Loading..." : "Sign in"}
            
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
