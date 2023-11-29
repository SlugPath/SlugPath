import { gql } from "@apollo/client";

export const GET_COURSES = gql`
  query getCourses($departmentCode: String!, $number: String = null) {
    coursesBy(departmentCode: $departmentCode, number: $number) {
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
