import React, { forwardRef } from "react";

// Define the props type for better type checking
type IconButtonProps = {
  onClick: () => void;
  color: "blue" | "green" | "red";
  children: React.ReactNode;
  id?: string;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ onClick, color, children, id }, ref) {
    // Secure way to handle dynamic colors with Tailwind
    const colorClasses = {
      blue: "bg-blue-400 hover:bg-blue-600",
      green: "bg-green-400 hover:bg-green-600",
      red: "bg-red-400 hover:bg-red-600",
    };

    // Fallback color if not specified or if the specified color isn't handled
    const buttonClasses = colorClasses[color] || "bg-gray-400 hover:bg-gray-600";

    return (
      <button
        ref={ref}
        id={id}
        onClick={onClick}
        className={`${buttonClasses} text-white font-bold py-2 px-4 rounded-full border-2 border-cyan-600 transition duration-300 ease-in-out flex items-center space-x-2 justify-center`}
      >
        {children}
      </button>
    );
  }
);

export default IconButton;