import type { ReactElement } from "react";

export function Sidebaritem({
  text,
  icon,
  onClick,
}: {
  text: string;
  icon: ReactElement;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center text-white py-2 cursor-pointer hover:bg-gray-500 rounded max-w-48 pl-4 space-x-2"
      onClick={onClick}
    >
      <span>{icon}</span>
      <span className="capitalize">{text}</span>
    </div>
  );
}
