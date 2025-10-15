import type { FC } from "react";
import {
  FaYoutube,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaSpotify,
  FaLinkedin,
  FaImages,
} from "react-icons/fa";

// 1️⃣ Define a properly typed icon map
const iconMap = {
  youtube: <FaYoutube className="text-red-500 text-2xl" />,
  twitter: <FaTwitter className="text-blue-400 text-2xl" />,
  facebook: <FaFacebook className="text-blue-600 text-2xl" />,
  instagram: <FaInstagram className="text-pink-500 text-2xl" />,
  pinterest: <FaPinterest className="text-red-600 text-2xl" />,
  spotify: <FaSpotify className="text-green-500 text-2xl" />,
  linkedin: <FaLinkedin className="text-blue-700 text-2xl" />,
  gallery: <FaImages className="text-gray-500 text-2xl" />,
} as const;

// 2️⃣ Create a TypeScript type for the valid keys
type ContentType = keyof typeof iconMap; // "youtube" | "twitter" | "facebook" | ...

// 3️⃣ Define the props interface using the type
interface ContentTypeDisplayProps {
  type: ContentType | string; // allow string to safely fallback if unknown
}

// 4️⃣ Define the component with correct typing
export const ContentTypeDisplay: FC<ContentTypeDisplayProps> = ({ type }) => {
  return (
    <div className="flex items-center font-semibold">
      <div className="text-gray-500">
        {iconMap[type as ContentType] || (
          <FaImages className="text-gray-500 text-2xl" />
        )}
      </div>
    </div>
  );
};
