import { useState } from "react";
import { InstagramIcon } from "../icons/InstagramIcon";
import { LinkedinIcon } from "../icons/LinkdinIcon";
import { SpotifyIcon } from "../icons/SpotifyIcon";
import { TwitterIcon } from "../icons/Twitter";
import { YouTubeIcon } from "../icons/YoutubeIcon";
import { Sidebaritem } from "./SidebarItem";
import logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";

export function Sidebar({ onFilter }: { onFilter: (platform: string | null) => void }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const handleFilter = (platform: string) => {
    // toggle: clicking the same platform clears the filter
    if (selected === platform) {
      setSelected(null);
      onFilter(null);
      return;
    }

    setSelected(platform);
    onFilter(platform);
  };

  return (
    <div className="bg-black border-r w-72 fixed top-0 left-0 h-screen">
      <div className="flex text-2xl text-white pt-4 items-center">
        <img
          src={logo}
          alt="Brainstorm Logo"
          className="w-40 sm:w-52 cursor-pointer select-none m-0 p-0"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="pt-4 text-white">
        <Sidebaritem text="twitter" icon={<TwitterIcon />} onClick={() => handleFilter("twitter")} />
        <Sidebaritem text="youtube" icon={<YouTubeIcon />} onClick={() => handleFilter("youtube")} />
        <Sidebaritem text="instagram" icon={<InstagramIcon />} onClick={() => handleFilter("instagram")} />
        <Sidebaritem text="spotify" icon={<SpotifyIcon />} onClick={() => handleFilter("spotify")} />
        <Sidebaritem text="linkedin" icon={<LinkedinIcon />} onClick={() => handleFilter("linkedin")} />
      </div>
    </div>
  );
}
