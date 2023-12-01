import { gql } from "@apollo/client";

export const GET_COURSES = gql`
  query getCourses(
    $departmentCode: String!
    $number: String = null
    $ge: String
  ) {
    coursesBy(departmentCode: $departmentCode, number: $number, ge: $ge) {
      title
      department
      departmentCode
      number
      credits
      ge
      quartersOffered
    }
  }
`;

export const GET_COURSE = gql`
  query getCourse($departmentCode: String!, $number: String!) {
    courseBy(departmentCode: $departmentCode, number: $number) {
      title
      department
      departmentCode
      number
      credits
      ge
      quartersOffered
      prerequisites
    }
  }
`;

export const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments {
      name
      code
    }
  }
`;

export const GET_LABELS = gql`
  query labels($userId: String!) {
    getLabels(userId: $userId) {
      color
      name
      id
    }
  }
`;

export const GET_MAJOR = gql`
  query major($userId: String!) {
    major(userId: $userId) {
      name
      catalog_year
      default_planner_id
    }
  }
`;

export const SAVE_MAJOR = gql`
  mutation saveMajor($userId: String!, $major: MajorInput!) {
    upsertMajor(userId: $userId, major: $major) {
      name
      catalog_year
      default_planner_id
    }
  }
`;

export const GET_PLANNERS = gql`
  query ($userId: String!) {
    getAllPlanners(userId: $userId) {
      title
      id
    }
  }
`;

export const GET_PLANNER = gql`
  query ($userId: String!, $plannerId: String!) {
    getPlanner(userId: $userId, plannerId: $plannerId) {
      quarters {
        title
        id
        courses {
          id
          departmentCode
          number
          quartersOffered
          ge
          title
          credits
          labels
        }
      }
      years
      labels {
        id
        name
        color
      }
    }
  }
`;
