"use client";

import React, { useEffect, useState } from "react";

// Function to check if the screen size is too small
const isScreenTooSmall = () => {
  const minWidth = 1030; // Set your minimum width threshold
  const minHeight = 400; // Set your minimum height threshold
  return window.innerWidth < minWidth || window.innerHeight < minHeight;
};

export interface MobileWarningModalProps {
  show: boolean;
  onClose: () => void;
}

// MobileWarningModal component
export const MobileWarningModal = ({
  show,
  onClose,
}: MobileWarningModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-3/4 text-center">
        <h2 className="text-lg font-bold mb-4">Low Resolution Warning</h2>
        <p>
          Your screen resolution is lower than recommended for the best
          experience. If using a mobile device, hold horizontally for better
          results.
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-primary-400 text-white font-bold py-2 px-4 rounded"
        >
          Continue Anyway
        </button>
      </div>
    </div>
  );
};

// ScreenSizeWarning component
const ScreenSizeWarning = () => {
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [userAcknowledged, setUserAcknowledged] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (isScreenTooSmall() && !userAcknowledged) {
        setShowMobileWarning(true);
      } else {
        setShowMobileWarning(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check screen size on initial load

    return () => window.removeEventListener("resize", handleResize);
  }, [userAcknowledged]);

  return (
    <MobileWarningModal
      show={showMobileWarning}
      onClose={() => {
        setShowMobileWarning(false);
        setUserAcknowledged(true);
      }}
    />
  );
};

export default ScreenSizeWarning;
