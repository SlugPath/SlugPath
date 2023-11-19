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

export const GET_LABELS = gql`
  query labels($userId: String!) {
    getLabels(userId: $userId) {
      color
      name
      id
    }
  }
`;
// export const GET_LABELS = gql`
//   query labels($input: LabelInput!) {
//     getLabels(input: $input) {
//       color
//       name
//       id
//     }
//   }
// `;
