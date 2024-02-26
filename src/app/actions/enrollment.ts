"use server";

import { terms } from "@/lib/consts";

import { StoredCourse } from "../types/Course";
import { Term } from "../types/Quarter";

type Instructor = {
  cruzid: string;
  name: string;
};
// getPastEnrollmentInfo returns the quarters offered and the professors who taught a course
// in past quarters
export async function getPastEnrollmentInfo(
  course: Pick<StoredCourse, "number" | "departmentCode">,
) {
  const pastQuarters = getPastQuarters();
  const pastOfferings = await Promise.all(
    pastQuarters.map(({ id }) =>
      fetch(createEnrollmentInfoURL(id, course)).then((res) => res.json()),
    ),
  ).then((offers) => {
    // Only get the valid offerings because sometimes a course is not offered
    // in a particular quarter
    const valid = offers.filter((of) => of.status === undefined);
    // Only get the offerings that match the course number
    const allClasses = valid
      .flatMap((v) => v.classes)
      .filter((c) => c.catalog_nbr === course.number);

    // Final transformation
    return allClasses.map((c) => ({
      term: getTermById(c.strm),
      instructors: c.instructors.flatMap((inst: Instructor) => inst.name),
    }));
  });
  return pastOfferings.toSorted((a, b) =>
    a.term.catalogYear.localeCompare(b.term.catalogYear),
  );
}

export async function getFutureEnrollmentInfo(
  course: Pick<StoredCourse, "number" | "departmentCode">,
) {
  const futureQuarters = getFutureQuarters();

  return Promise.all(
    futureQuarters.map(({ id }) =>
      fetch(createEnrollmentInfoURL(id, course), {
        next: {
          // Revalidate every 15 minutes
          revalidate: 900,
        },
      }).then((res) => res.json()),
    ),
  );
}

export async function getQuartersOffered(course: StoredCourse) {
  const url = createEnrollmentInfoURL(2248, course);
  const res = await fetch(url);
  return await res.json();
}

// =========== Helper functions =============
function createEnrollmentInfoURL(
  termId: number,
  { number, departmentCode }: Pick<StoredCourse, "number" | "departmentCode">,
) {
  return `https://my.ucsc.edu/PSIGW/RESTListeningConnector/PSFT_CSPRD/SCX_CLASS_LIST.v1/${termId}?subject=${departmentCode}&catalog_nbr=${number}`;
}

function getCurrentQuarter() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  let term: Term;
  switch (true) {
    case currentMonth >= 9 && currentMonth <= 12:
      term = "Fall";
      break;
    case currentMonth >= 1 && currentMonth <= 3:
      term = "Winter";
      break;
    case currentMonth >= 4 && currentMonth <= 6:
      term = "Spring";
      break;
    default:
      term = "Summer";
  }

  let catalogYear: string;
  if (term === "Fall") {
    catalogYear = `${currentYear}-${currentYear + 1}`;
  } else {
    catalogYear = `${currentYear - 1}-${currentYear}`;
  }

  const currentQuarter = terms.find(
    (t) => t.title === term && t.catalogYear === catalogYear,
  );
  if (!currentQuarter) throw new Error("unable to get current quarter");
  return currentQuarter;
}

function getFutureQuarters() {
  const { id: currentId } = getCurrentQuarter();
  return terms.filter((t) => t.id > currentId);
}

function getPastQuarters() {
  const { id: currentId } = getCurrentQuarter();
  return terms.filter((t) => t.id <= currentId);
}

function getTermById(id: string) {
  const term = terms.find((t) => `${t.id}` === id);
  if (!term) throw new Error(`couldn't find term by id ${id}`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...rest } = term;
  return rest;
}
