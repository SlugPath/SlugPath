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
