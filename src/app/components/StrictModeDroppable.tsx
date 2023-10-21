import { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";

// KEEP THIS! This is a workaround for a bug with Droppable in react-beautiful-dnd
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
    cancelAnimationFrame(animation);
    setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};