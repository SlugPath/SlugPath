import { ApolloError, gql, useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import useLocalState from "./useLocalState";
import { MultiPlanner } from "../ts-types/MultiPlanner";
import { v4 as uuidv4 } from "uuid";
import { PlannerTitle } from "@/graphql/planner/schema";
import { initialPlanner } from "@/lib/initialPlanner";
import { PlannerData } from "../ts-types/PlannerData";
import { removeTypenames } from "@/lib/utils";

const GET_PLANNERS = gql`
  query ($userId: String!) {
    getAllPlanners(userId: $userId) {
      title
      id
    }
  }
`;

const GET_PLANNER = gql`
  query ($userId: String!, $plannerId: String!) {
    getPlanner(userId: $userId, plannerId: $plannerId) {
      quarters {
        title
        id
        courses {
          department
          number
        }
      }
      years
    }
  }
`;

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
  const [state, setState] = useLocalState<MultiPlanner>("planners", {
    [uuidv4()]: ["Planner 1", true],
  });
  const [getData, { loading, error }] = useLazyQuery(GET_PLANNERS, {
    onCompleted: (data) => {
      console.log(`COMPLETED LOAD ALL ${JSON.stringify(data.getAllPlanners)}`);
      setState(convertPlannerTitles(data.getAllPlanners));
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
): [
  PlannerData,
  React.Dispatch<React.SetStateAction<PlannerData>>,
  { loading: boolean; error: ApolloError | undefined },
] => {
  const [state, setState] = useLocalState<PlannerData>(
    `planner${plannerId}`,
    initialPlanner,
  );
  const [getData, { loading, error }] = useLazyQuery(GET_PLANNER, {
    onCompleted: (data) => {
      const planner = data.getPlanner;
      if (planner !== null) {
        removeTypenames(planner);
        console.log(`In Load Single: ${JSON.stringify(planner)}`);
        setState(planner);
      }
    },
    onError: (err) => {
      console.error(err);
    },
    variables: {
      userId: userId ?? "",
      plannerId,
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

const convertPlannerTitles = (queryResult: PlannerTitle[]): MultiPlanner => {
  const mp: MultiPlanner = {};

  queryResult.forEach((p, idx) => {
    if (idx == 0) {
      mp[p.id] = [p.title, true];
    } else {
      mp[p.id] = [p.title, false];
    }
  });

  return mp;
};
