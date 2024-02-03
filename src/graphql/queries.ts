import { gql } from "@apollo/client";

export const DELETE_PLANNER = gql`
  mutation DeletePlanner($userId: String!, $plannerId: String!) {
    deletePlanner(userId: $userId, plannerId: $plannerId) {
      plannerId
    }
  }
`;

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
      description
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
      description
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

export const GET_ALL_MAJORS = gql`
  query getMajors($catalogYear: String!) {
    getAllMajors(catalogYear: $catalogYear)
  }
`;
export const GET_MAJOR = gql`
  query major($userId: String!) {
    getUserMajor(userId: $userId) {
      name
      catalogYear
      defaultPlannerId
      id
    }
  }
`;

export const GET_MAJOR_DEFAULT_PLANNERS = gql`
  query getMajorDefaultPlannerIds($input: MajorDefaultsInput!) {
    getMajorDefaults(input: $input) {
      title
      id
    }
  }
`;

export const SAVE_MAJOR = gql`
  mutation saveMajor($input: MajorInput!) {
    updateUserMajor(input: $input) {
      name
      catalogYear
      defaultPlannerId
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
  query ($userId: String, $plannerId: String!) {
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
          description
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
      notes
    }
  }
`;
