import { useState, useEffect } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { SaveIcon } from "../icons/SaveIcon";
import { ContentTypeDisplay } from "./typeicon";

/* -------------------------------------------------
   Card Props
-------------------------------------------------- */
interface CardProps {
  _id?: string;
  id?: string;
  type?: string;
  title: string;
  link: string; // YouTube, X, LinkedIn, Instagram, or Spotify link
  onDelete?: (id?: string) => void;
}

/* -------------------------------------------------
   Main Card Component
-------------------------------------------------- */
export default function Card({ _id, id, title, link, onDelete }: CardProps) {
  const videoId = _id || id;
  const type = detectContentType(link);

  return (
    <div className="bg-black text-white rounded-lg p-2 border border-gray-800 w-full sm:w-[48%] md:w-[33%] lg:w-[26%] max-w-[260px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ContentTypeDisplay type={type} />
          <div className="font-medium text-sm break-all">{title}</div>
        </div>

        <div className="flex items-center gap-2">
          <a href={link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
            <SaveIcon />
          </a>
          {onDelete && (
            <div
              className="cursor-pointer text-gray-400 hover:text-red-400"
              onClick={() => onDelete(videoId)}
            >
              <DeleteIcon />
            </div>
          )}
        </div>
      </div>

      {/* Embedded content */}
      <div className="mt-2">
        <ContentEmbed type={type} link={link} />
      </div>
    </div>
  );
}

/* -------------------------------------------------
   Detect content type from link
-------------------------------------------------- */
function detectContentType(link: string): "youtube" | "x" | "linkedin" | "instagram" | "spotify" | "unknown" {
  const url = link.toLowerCase();
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("twitter.com") || url.includes("x.com")) return "x";
  if (url.includes("linkedin.com")) return "linkedin";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("spotify.com")) return "spotify";
  return "unknown";
}

/* -------------------------------------------------
   Main Embed Switch
-------------------------------------------------- */
function ContentEmbed({ type, link }: { type: string; link: string }) {
  switch (type) {
    case "youtube":
      return <YouTubeEmbed link={link} small />;
    case "x":
      return <XEmbed link={link} />;
    case "linkedin":
      return <LinkedInEmbed link={link} />;
    case "instagram":
      return <InstagramEmbed link={link} />;
    case "spotify":
      return <SpotifyEmbed link={link} />;
    default:
      return <div className="text-gray-400 text-sm">Unsupported link</div>;
  }
}

/* -------------------------------------------------
   YouTube Embed
-------------------------------------------------- */
function YouTubeEmbed({ link, small = false }: { link: string; small?: boolean }) {
  const [showPlayer, setShowPlayer] = useState(false);

  function extractVideoId(url: string): string | null {
    try {
      const parsed = new URL(url);
      if (parsed.hostname === "youtu.be") return parsed.pathname.substring(1);
      if (parsed.hostname.includes("youtube.com") && parsed.searchParams.has("v"))
        return parsed.searchParams.get("v");
      const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  const videoId = extractVideoId(link);
  if (!videoId) return <div className="text-gray-400 text-sm">Invalid YouTube link</div>;

  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  const heightPx = small ? 120 : 300;

  return (
    <div className="relative w-full rounded-md overflow-hidden" style={{ height: `${heightPx}px` }}>
      {!showPlayer ? (
        <button onClick={() => setShowPlayer(true)} className="relative w-full block group h-full">
          <img src={thumbnail} alt="Video thumbnail" className="w-full h-full rounded-md object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition">
            <div className="bg-white/80 rounded-full p-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="black">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      ) : (
        <iframe
          width="100%"
          style={{ height: `${heightPx}px` }}
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full rounded-md"
        ></iframe>
      )}
    </div>
  );
}

/* -------------------------------------------------
   X (Twitter) Embed
-------------------------------------------------- */
/* -------------------------------------------------
   X (Twitter) Embed — Fixed & Reliable
-------------------------------------------------- */
function XEmbed({ link }: { link: string }) {
  useEffect(() => {
    // Load script if not already present
    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[src='https://platform.twitter.com/widgets.js']"
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = () => {
        // Initialize embeds once loaded
        if (window.twttr?.widgets) {
          window.twttr.widgets.load();
        }
      };
      document.body.appendChild(script);
    } else {
      // Already loaded — just trigger re-render of embeds
      if (window.twttr?.widgets) {
        window.twttr.widgets.load();
      }
    }
  }, [link]);

  return (
    <blockquote
      className="twitter-tweet"
      data-theme="dark"
      style={{
        background: "#000",
        borderRadius: "8px",
        padding: "0",
        margin: "auto",
        width: "100%",
        maxWidth: "320px",
      }}
    >
      <a href={link}></a>
    </blockquote>
  );
}

/* -------------------------------------------------
   LinkedIn Embed
-------------------------------------------------- */
function LinkedInEmbed({ link }: { link: string }) {
  // LinkedIn uses iframe embeds for posts
  const match = link.match(/urn:li:activity:(\d+)/);
  const activity = match ? match[0] : null;
  if (!activity)
    return <div className="text-gray-400 text-sm">Invalid LinkedIn link</div>;

  const embedUrl = `https://www.linkedin.com/embed/feed/update/${activity}`;
  return (
    <iframe
      src={embedUrl}
      height="300"
      width="100%"
      className="rounded-md"
      frameBorder="0"
      allowFullScreen
    ></iframe>
  );
}

/* -------------------------------------------------
   Instagram Embed
-------------------------------------------------- */
function InstagramEmbed({ link }: { link: string }) {
  useEffect(() => {
    if (!window.instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
  window.instgrm?.Embeds?.process();
    }
  }, [link]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={link}
      data-instgrm-version="14"
      style={{
        background: "#000",
        borderRadius: "8px",
        padding: "0",
        margin: "auto",
        width: "100%",
        maxWidth: "320px",
      }}
    ></blockquote>
  );
}

/* -------------------------------------------------
   Spotify Embed
-------------------------------------------------- */
function SpotifyEmbed({ link }: { link: string }) {
  const embedLink = link.replace("open.spotify.com/", "open.spotify.com/embed/");
  return (
    <iframe
      src={embedLink}
      width="100%"
      height="152"
      className="rounded-md"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    ></iframe>
  );
}

/* -------------------------------------------------
   Export
-------------------------------------------------- */
export { Card };

/* -------------------------------------------------
   Type Declarations (for TS)
-------------------------------------------------- */
declare global {
  interface Window {
    twttr?: { widgets?: { load: () => void } };
    instgrm?: { Embeds?: { process: () => void } };
  }
}
