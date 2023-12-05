import { ApolloError, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { deserializePlanner, initialPlanner } from "@/lib/plannerUtils";
import { MultiPlanner } from "../types/MultiPlanner";
import { PlannerData } from "../types/PlannerData";
import { removeTypenames } from "@/lib/utils";
import { convertPlannerTitles } from "@/lib/plannerUtils";
import { GET_PLANNERS, GET_PLANNER } from "@/graphql/queries";

/**
 * Custom hook to load all planners for a particular user
 * @param userId id of the user
 * @returns
 */
export const useLoadAllPlanners = (
  userId: string | undefined,
): [
  MultiPlanner,
  React.Dispatch<React.SetStateAction<MultiPlanner>>,
  { loading: boolean; error: ApolloError | undefined },
] => {
  const [state, setState] = useState<MultiPlanner>({});
  const [getData, { loading, error }] = useLazyQuery(GET_PLANNERS, {
    onCompleted: (data) => {
      if (data.getAllPlanners.length > 0) {
        setState(convertPlannerTitles(data.getAllPlanners));
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

  return [state, setState, { loading, error }];
};

/**
 * Custom hook to load a particular user's planner
 * @param plannerId id of the planner to load
 * @param userId id of the user
 * @returns
 */
export const useLoadPlanner = (
  plannerId: string,
  userId: string | undefined,
  skipLoad?: boolean,
  /* defaultPlannerId: string | undefined | null, */
): [
  PlannerData,
  React.Dispatch<React.SetStateAction<PlannerData>>,
  { loading: boolean; error: ApolloError | undefined },
] => {
  // TODO: instead of initialPlanner use the defaultPlanner.
  // potentially store the defaultPlanner data in a context to avoid
  // having to make multiple network calls in one session.
  const [state, setState] = useState<PlannerData>(initialPlanner);
  const [getData, { loading, error }] = useLazyQuery(GET_PLANNER, {
    onCompleted: (data) => {
      const planner = data.getPlanner;
      if (planner !== null) {
        removeTypenames(planner);
        setState(deserializePlanner(planner));
      }
    },
    onError: (err) => {
      console.error(err);
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (skipLoad) return;
    getData({
      variables: {
        userId,
        plannerId,
      },
    });
  }, [userId, plannerId, getData, skipLoad]);

  return [state, setState, { loading, error }];
};
