import { serializePlanner } from "@/lib/plannerUtils";
import { debounce } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { PlannerData } from "../types/PlannerData";
import { gql, useMutation } from "@apollo/client";

const SAVE_PLANNER = gql`
  mutation SavePlanner($input: PlannerCreateInput!) {
    upsertPlanner(input: $input) {
      plannerId
    }
  }
`;

interface AutosaveInput {
  plannerData: PlannerData;
  userId: string | undefined;
  plannerId: string;
  title: string;
  order: number;
}

export default function useAutosave(input: AutosaveInput) {
  // Mutation function from Apollo Client to invoke the GraphQL API
  const [mutation, { loading, error }] = useMutation(SAVE_PLANNER);

  // Abort controller
  const controller = useRef(new AbortController());

  // Debounced save -- save after 3 seconds of changes
  const saveData = debounce((options) => {
    // Abort any previous outgoing requests
    controller.current.abort();
    controller.current = new AbortController();
    return mutation({
      ...options,
      options: {
        context: {
          fetchoptions: {
            signal: controller.current.signal,
          },
        },
      },
    });
  }, 5000);

  // Executes saving side effect
  useEffect(() => {
    if (
      input.userId !== undefined &&
      input.title.length > 1 &&
      input.title.length < 20
    ) {
      const variables = {
        input: {
          ...input,
          plannerData: serializePlanner(input.plannerData),
        },
      };
      saveData({
        variables,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(input)]);

  // Clean-up
  useEffect(() => {
    return () => {
      controller.current.abort();
    };
  }, []);

  return { loading, error };
}
