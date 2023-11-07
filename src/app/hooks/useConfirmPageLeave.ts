import { useEffect } from "react";

/**
 * Prompts a user for confirmation before they exit the page
 * @param shouldConfirm a boolean indicating if the user should be prompted before they exit
 */
export default function useConfirmPageLeave(shouldConfirm: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldConfirm) return;

      const message = "You are not logged in. Log in to save your changes";
      e.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldConfirm]);
}
