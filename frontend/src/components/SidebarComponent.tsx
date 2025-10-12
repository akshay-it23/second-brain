import { InstagramIcon } from "../icons/InstagramIcon";
import { LinkedinIcon } from "../icons/LinkdinIcon";
import { Logo } from "../icons/logo";
import { SpotifyIcon } from "../icons/SpotifyIcon";
import { TwitterIcon } from "../icons/Twitter";
import { YouTubeIcon } from "../icons/YoutubeIcon";
import { Sidebaritem } from "./SidebarItem";

export function Sidebar(){
    return <div className="h-screen bg-white border-r w-72 absolute  fixed left-0 top-0">
        <div className="flex text-2xl pt-4 items-center">
               <Logo className="w-8 h-8" /> 
             <span className="font-semibold">Brainly</span>
        </div>
         
        <div className="pt-4">
            <Sidebaritem text="twitter" icon={<TwitterIcon/>}/>
            <Sidebaritem text="youtube" icon={<YouTubeIcon/>}/>
            <Sidebaritem text="instagram" icon={<InstagramIcon/>}/>           
            <Sidebaritem text="Spotify" icon={<SpotifyIcon/>}/>            
            <Sidebaritem text="Linkdin" icon={<LinkedinIcon/>}/>            
        </div>
    </div>
}