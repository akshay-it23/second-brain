import logo from '../assets/Logo.png'; 
import ss3 from '../assets/ss3.png';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';


export function Landing() {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-screen overflow-hidden">

        
            <img 
                src={ss3} 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover z-0 " 
            />
          
            <div className="absolute inset-0 bg-black/50 z-10"></div>

          
            <div className="relative h-screen bg-transparent md:px-20 sm:px-16 px-8 flex flex-col justify-center z-20">
   <div className="fixed top-0 left-0 w-full flex gap-7 justify-between items-start m-0 p-0 z-50">
  {/* Logo */}
  <img 
    src={logo} 
    alt="Brainstrom Logo" 
    className="w-40 sm:w-52 cursor-pointer select-none m-0 p-0" 
    onClick={() => navigate('/')} 
  />

  {/* Buttons */}
  <div className="flex gap-5 m-2 p-2
  
  items-start">
    <Button 
      variant="primary" 
      color="white" 
      size="sm"  
      text="Login" 
      onClick={() => navigate('/login')} 
    />
    <Button 
      variant="primary" 
      color="black" 
      size="sm"   
      text="SignUp" 
      onClick={() => navigate('/signup')} 
    />
  </div>
</div>
       {/* Hero Section */}
                <div className="h-full flex justify-between items-center">
                    <div className="h-full">
                     <div className="h-full font-sans flex flex-col gap-2 sm:justify-center mt-0 text-white items-center sm:items-start">

                            <div className="sm:text-5xl text-4xl text-center sm:text-start">Your Official</div>
                            <div className="text-gradient bg-text-gradient sm:text-8xl text-7xl font-bold text-center sm:text-start mb-3 text-pretty">
                                Second Brain
                            </div>
                            <div className="sm:text-xl text-sm text-center sm:text-start text-slate-500 mb-3">
                                Store all your links at one place
                            </div>
                            <div className="flex justify-center sm:justify-start">
                                <Button 
                                    variant="primary" 
                                    color="white" 
                                    size="lg" 
                                    text="Login" 
                                    onClick={() => { navigate('/login'); }} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Brain image */}
                    <div className="sm:flex gap-2 justify-center items-center hidden overflow-hidden">
                    
                    </div>
                </div>
            </div>
        </div>
    );
}
