import {
  MutationHookOptions,
  useMutation,
  TypedDocumentNode,
  ApolloCache,
  DefaultContext,
  MutationTuple,
} from "@apollo/client";
import { debounce } from "@/lib/utils";
import { DocumentNode } from "graphql";

const debounceMutation = debounce((mutation, options) => {
  const controller = new AbortController();

  return mutation({
    ...options,
    options: {
      context: {
        fetchOptions: {
          signal: controller.signal,
        },
      },
    },
  });
}, 500);

const useAutosave = <
  TData,
  TVariables,
  TCache extends ApolloCache<any> = ApolloCache<any>,
>(
  GQL: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: MutationHookOptions<TData, TVariables, DefaultContext>,
): MutationTuple<TData, TVariables, DefaultContext, TCache> => {
  const [mutation, rest] = useMutation<TData, TVariables>(GQL, options);

  return [(options: any) => debounceMutation(mutation, options), rest];
};

export default useAutosave;
