import { ShareIcon } from "../icons/share";

interface CardProps {
  title?: string;
  link?: string;
  type?: string;
}

export function Card({ title, link }: CardProps) {
  const videoId = "5_RvWJXZjuI";

  return (
    <div className="p-8 bg-white rounded-md shadow-md border-gray-100 max-w-96 border">
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-500 flex items-center gap-2">
          <ShareIcon /> {title || "Project Ideas"}
        </div>
        <div className="text-gray-500">
          <a href={link}>
            <ShareIcon />
          </a>
        </div>
      </div>

      <iframe
        width="100%"
        height="200"
        src={`${link}${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-md"
      ></iframe>
    </div>
  );
}
