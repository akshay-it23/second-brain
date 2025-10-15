import type { FC } from "react";

// Define a simple IconProps interface
// (You can move this to your central `icons/index.ts` if multiple icons use it)
interface IconProps {
  size?: number;
  className?: string;
}

// Define the DeleteIcon component using IconProps
export const DeleteIcon: FC<IconProps> = ({ size = 24, className = "text-gray-700" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
    >
      <path d="M3 3H21V5H3z" />
      <path d="M16.1,22H7.9c-1,0-1.9-0.7-2-1.7L4,4.1l2-0.2L7.9,20l8.2,0L18,3.9l2,0.2l-1.9,16.1C18,21.3,17.1,22,16.1,22z" />
      <path
        d="M5,4l1.9,16.1c0.1,0.5,0.5,0.9,1,0.9h8.2 c0.5,0,0.9-0.4,1-0.9L19,4H5z"
        opacity=".3"
      />
      <path d="M15 3L15 4 9 4 9 3 10 2 14 2z" />
    </svg>
  );
};
