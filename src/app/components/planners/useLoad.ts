import { ApolloError, useLazyQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  deserializePlanner,
  getTotalCredits,
  initialPlanner,
} from "@/lib/plannerUtils";
import { PlannerData } from "../../types/PlannerData";
import { removeTypenames } from "@/lib/utils";
import { GET_PLANNERS, GET_PLANNER } from "@/graphql/queries";
import { initialLabels } from "@/lib/labels";
import { DefaultPlannerContext } from "../../contexts/DefaultPlannerProvider";
import useMajorSelection from "../majorSelection/useMajorSelection";
import { v4 as uuidv4 } from "uuid";
import { PlannerTitle } from "@/graphql/planner/schema";
import { SetState } from "@/app/types/Common";

/**
 * Custom hook to load all planners for a particular user
 * @param userId id of the user
 * @returns
 */

export const useLoadAllPlanners = (
  userId: string | undefined,
  onLoadedPlanners?: (numPlanners: number) => void,
): [
  PlannerTitle[],
  SetState<PlannerTitle[]>,
  string | undefined,
  SetState<string | undefined>,
  { loading: boolean; error: ApolloError | undefined },
] => {
  const [planners, setPlanners] = useState<PlannerTitle[]>([]);
  const [activePlanner, setActivePlanner] = useState<string | undefined>(
    undefined,
  );

  const [getData, { loading, error }] = useLazyQuery(GET_PLANNERS, {
    onCompleted: (data) => {
      if (data.getAllPlanners.length > 0) {
        const loadedPlanners = data.getAllPlanners;
        removeTypenames(loadedPlanners);
        // Set the first planner as active, if it exists
        setPlanners(loadedPlanners);
        setActivePlanner(loadedPlanners[0]?.id);
      }
      if (onLoadedPlanners !== undefined) {
        onLoadedPlanners(data.getAllPlanners.length);
      }
    },
    onError: (err) => {
      console.error(err);
    },
  });

  useEffect(() => {
    if (userId !== undefined) {
      getData({
        variables: {
          userId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return [
    planners,
    setPlanners,
    activePlanner,
    setActivePlanner,
    { loading, error },
  ];
};

/**
 * Hook that loads the default planner of a particular user.
 * @param userId id of a user
 * @returns
 */
export const useLoadDefaultPlanner = (userId?: string) => {
  const { userMajorData } = useMajorSelection(userId);
  const plannerId = userMajorData?.defaultPlannerId;
  const skipLoad = userMajorData === undefined || plannerId === undefined;

  return useLoadPlanner({
    plannerId,
    userId: undefined,
    defaultPlanner: initialPlanner(),
    skipLoad,
  });
};

/**
 * Copies a PlannerData, but changes the id's of the courses within the planner
 * to prevent data inconsistencies
 * Also adds a value for notes
 * @param defaultPlanner a defaultPlanner
 * @returns a unique PlannerData instance
 */
const cloneDefaultPlanner = (defaultPlanner: PlannerData): PlannerData => {
  const clone = { ...defaultPlanner };
  // Create a lookup table between old ids and newStoredCourse
  const lookup = {} as any;
  defaultPlanner.courses.forEach((c) => {
    lookup[c.id] = { ...c, id: uuidv4() };
  });
  // Pass the new Stored courses to the clone
  clone.courses = Object.values(lookup);

  // Replace all the references in the quarters to course ids with their new
  // counterparts
  clone.quarters = defaultPlanner.quarters.map((q) => {
    return {
      ...q,
      courses: q.courses.map((crs) => {
        return lookup[crs].id;
      }),
      notes: "",
    };
  });
  return clone;
};

/**
 * Hook to load a user planner
 */
export const useLoadUserPlanner = ({
  userId,
  plannerId,
  skipLoad,
}: {
  userId: string | undefined;
  plannerId: string;
  skipLoad?: boolean;
}) => {
  const { defaultPlanner } = useContext(DefaultPlannerContext);
  const clonedPlanner = cloneDefaultPlanner(defaultPlanner);
  return useLoadPlanner({
    plannerId,
    userId,
    defaultPlanner: clonedPlanner,
    skipLoad,
  });
};

/**
 * Hook to load a planner
 * @param plannerId id of the planner to load
 * @param userId id of the user
 * @returns
 */
export const useLoadPlanner = ({
  plannerId,
  userId,
  defaultPlanner,
  skipLoad,
}: {
  plannerId: string;
  userId: string | undefined;
  defaultPlanner: PlannerData;
  skipLoad?: boolean;
}): [
  PlannerData,
  React.Dispatch<React.SetStateAction<PlannerData>>,
  { loading: boolean; error: ApolloError | undefined },
] => {
  const { setHasAutoFilled } = useContext(DefaultPlannerContext);
  const [planner, setPlanner] = useState<PlannerData>(defaultPlanner);
  const [getData, { loading, error }] = useLazyQuery(GET_PLANNER, {
    onCompleted: (data) => {
      const planner = data.getPlanner;
      if (planner !== null) {
        removeTypenames(planner);
        setPlanner(deserializePlanner(planner));
      }

      if (data.getPlanner === null) {
        autofillWithDefaultPlanner();
      }
    },
    onError: (err) => {
      console.error(err);
    },
    fetchPolicy: "no-cache",
  });

  function autofillWithDefaultPlanner() {
    setPlanner({
      ...defaultPlanner,
      labels: initialLabels(),
    });
    if (getTotalCredits(defaultPlanner.courses) > 0) {
      setHasAutoFilled(true);
    }
  }

  useEffect(() => {
    if (skipLoad) return;
    getData({
      variables: {
        userId,
        plannerId,
      },
    });
  }, [userId, plannerId, getData, skipLoad]);

  return [planner, setPlanner, { loading, error }];
};
