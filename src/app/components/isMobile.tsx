import React from "react";

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

export const MobileWarningModal = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-3/4 text-center">
        <h2 className="text-lg font-bold mb-2">Attention</h2>
        <p>
          The Course Planner was not optimized for phones. Please use a desktop
          for a better experience.
        </p>
      </div>
    </div>
  );
};
