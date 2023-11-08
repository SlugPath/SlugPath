import { ApolloError, gql, useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import useLocalState from "./useLocalState";
import { MultiPlanner } from "../ts-types/MultiPlanner";
import { v4 as uuidv4 } from "uuid";
import { PlannerTitle } from "@/graphql/planner/schema";

const GET_PLANNERS = gql`
  query getPlanners($userId: String!) {
    getAllPlanners(userId: $userId) {
      id
      title
    }
  }
`;

const useLoadPlanners = (
  userId: string,
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
  }, []);

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

export default useLoadPlanners;
