import { GET_LABELS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { Label } from "../types/Label";
import { useState } from "react";

const initialLabels: Label[] = [
  {
    id: "1",
    name: "",
    color: "red",
  },
  {
    id: "2",
    name: "",
    color: "green",
  },
  {
    id: "3",
    name: "",
    color: "blue",
  },
  {
    id: "4",
    name: "",
    color: "yellow",
  },
  {
    id: "5",
    name: "",
    color: "purple",
  },
  {
    id: "6",
    name: "",
    color: "orange",
  },
  {
    id: "7",
    name: "",
    color: "pink",
  },
];

export function useLabels(userId: string | undefined) {
  useQuery(GET_LABELS, {
    variables: {
      userId,
    },
    skip: !userId,
    onCompleted: (data) => {
      setLabels(data.getLabels);
    },
  });
  const [labels, setLabels] = useState<Label[]>(initialLabels);

  function updateLabels(labels: Label[]) {
    setLabels((prev) => {
      const newLabels = [...prev];
      labels.forEach((label) => {
        const id = newLabels.findIndex((l) => l.id === label.id);
        if (id != -1) {
          newLabels[id] = label;
        }
      });
      return newLabels;
    });
  }

  return {
    labels,
    updateLabels,
  };
}
