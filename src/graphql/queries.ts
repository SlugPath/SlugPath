import { gql } from "@apollo/client";

export const GET_COURSES = gql`
  query getCourses($department: String!, $number: String = null) {
    coursesBy(department: $department, number: $number) {
      name
      department
      number
      credits
      quartersOffered
    }
  }
`;

export const GET_COURSE = gql`
  query getCourse($department: String!, $number: String!) {
    courseBy(department: $department, number: $number) {
      name
      department
      number
      credits
      quartersOffered
    }
  }
`;
