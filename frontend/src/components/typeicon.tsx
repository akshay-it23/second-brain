// Importing specific icons from the 'react-icons/fa' library (Font Awesome icons).
// These will be used to visually represent different content types (like YouTube, Twitter, etc.)
import { 
  FaYoutube, 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaPinterest, 
  FaSpotify, 
  FaLinkedin, 
  FaImages 
} from "react-icons/fa";

// Creating an object that maps content type names (like "youtube", "twitter")
// to their corresponding JSX icon components with color and size styling.
const iconMap = {
  youtube: <FaYoutube className="text-red-500 text-2xl" />,   // YouTube icon with red color
  twitter: <FaTwitter className="text-blue-400 text-2xl" />,   // Twitter icon with light blue color
  facebook: <FaFacebook className="text-blue-600 text-2xl" />, // Facebook icon with dark blue color
  instagram: <FaInstagram className="text-pink-500 text-2xl" />, // Instagram icon with pink color
  pinterest: <FaPinterest className="text-red-600 text-2xl" />, // Pinterest icon with deep red color
  spotify: <FaSpotify className="text-green-500 text-2xl" />,   // Spotify icon with green color
  linkedin: <FaLinkedin className="text-blue-700 text-2xl" />,  // LinkedIn icon with deep blue color
  gallery: <FaImages className="text-gray-500 text-2xl" />,     // Default gallery icon (gray)
};

// Define a React component called ContentTypeDisplay that receives a prop named "type"
export function ContentTypeDisplay({ type }) {
  return (
    // A flex container that aligns icon and text (if added later) vertically centered
    <div className="flex items-center font-semibold">
      
      {/* A div to hold and style the icon */}
      <div className="text-gray-500">
        
        {/* Display the icon corresponding to the 'type' prop from iconMap */}
        {/* If the given 'type' does not exist in iconMap, show a default gallery icon */}
        {iconMap[type] || <FaImages className="text-gray-500 text-2xl" />} 

        {/* 
          Example: 
          If type="youtube" → shows red YouTube icon.
          If type="unknown" → shows gray gallery icon (default). 
        */}
      </div>
    </div>
  );
}
