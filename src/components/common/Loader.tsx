import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ size = "md", fullScreen = false }) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const loader = (
    <div className={`${sizeMap[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return <div className="flex justify-center items-center">{loader}</div>;
};
