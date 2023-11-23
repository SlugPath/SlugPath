/**
 * MultiPlanner is the data type responsible for storing the mapping of
 * planner ids -> planner titles and active status
 */
export interface MultiPlanner {
  [key: string]: [string, boolean];
}
