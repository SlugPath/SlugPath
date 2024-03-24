"use server";

import { terms } from "@/lib/consts";
import { z } from "zod";

import { StoredCourse } from "../types/Course";
import { Term, termOrder } from "../types/Quarter";

type Instructor = {
  cruzid: string;
  name: string;
};

type CourseEnrollQuery = Pick<StoredCourse, "number" | "departmentCode">;

const classInfoSchema = z.object({
  strm: z.string(),
  class_nbr: z.string(),
  class_section: z.string(),
  session_code: z.string(),
  class_status: z.string(),
  subject: z.string(),
  catalog_nbr: z.string(),
  component: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  location: z.string(),
  meeting_days: z.string(),
  enrl_status: z.string(),
  waitlist_total: z.string(),
  enrl_capacity: z.string(),
  enrl_total: z.string(),
  instructors: z.custom<Instructor[]>(),
});

type ClassInfo = z.infer<typeof classInfoSchema>;

type ClassOffering = {
  term: {
    title: Term;
    catalogYear: string;
  };
  instructor: string;
};

const termEnrollmentSchema = z.object({
  classes: z.array(classInfoSchema),
});

type TermEnrollmentInfo = z.infer<typeof termEnrollmentSchema>[];

function cmpOfferings(a: ClassOffering, b: ClassOffering) {
  if (a.term.catalogYear !== b.term.catalogYear)
    return a.term.catalogYear.localeCompare(b.term.catalogYear);
  return termOrder[a.term.title] - termOrder[b.term.title];
}

// getEnrollmentInfo returns the quarters offered and the professors who taught a course
// in past quarters and upcoming quarters.
export async function getEnrollmentInfo(course: CourseEnrollQuery) {
  const pastOfferings = await Promise.all(
    terms.map(({ id }) =>
      fetch(createEnrollmentInfoURL(id, course)).then((res) => res.json()),
    ),
  ).then((offers) => {
    // Get the term and instructors for each time the course was offered previously
    return filterOfferings(offers, course).map((c) => ({
      term: getTermById(c.strm),
      // Get last name of instructor
      instructor: c.instructors[0].name.split(",")[0],
    }));
  });
  pastOfferings.sort(cmpOfferings);
  return pastOfferings;
}

// getMoreEnrollmentInfo returns current and future enrollment information about a particular
// course
export async function getMoreEnrollmentInfo(course: CourseEnrollQuery) {
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
  ).then((offers) => {
    return filterOfferings(offers, course).map((c) => ({
      term: getTermById(c.strm),
      instructor: c.instructors[0].name,
      class_meeting: `${c.start_time} - ${c.end_time}, ${c.meeting_days} @${c.location}`,
      class_section: c.class_section,
      waitlist_total: c.waitlist_total,
      enrolled: `${c.enrl_total} of ${c.enrl_capacity} enrolled`,
    }));
  });
}

// =========== Helper functions =============
// function getTransferURL(
//   institution: string,
//   department: number,
// ) {
//   return `https://assist.org/api/articulation/Agreements?Key=${data.YEAR}/${institution}/to/${data.UCSC}/${department}`;

function createEnrollmentInfoURL(
  termId: number,
  { number, departmentCode }: Pick<StoredCourse, "number" | "departmentCode">,
) {
  return `https://my.ucsc.edu/PSIGW/RESTListeningConnector/PSFT_CSPRD/SCX_CLASS_LIST.v1/${termId}?subject=${departmentCode}&catalog_nbr=${number}`;
}

function getCurrentQuarter() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear() - 2000;
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
  return terms.filter((t) => t.id >= currentId);
}

function getTermById(id: string) {
  const term = terms.find((t) => `${t.id}` === id);
  if (!term) throw new Error(`couldn't find term by id ${id}`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...rest } = term;
  return rest;
}

function filterOfferings(offers: any[], course: CourseEnrollQuery) {
  // Filter offerings because sometimes a course is not offered
  // in a particular quarter. We do this using zod to safely parse
  const termInfo: TermEnrollmentInfo = offers.filter(
    (off) => termEnrollmentSchema.safeParse(off).success,
  );
  // Only get the offerings that match the course number
  // TODO: currently returns multiple instances for classes with multiple instructors in one term
  const allClasses: ClassInfo[] = termInfo
    .flatMap((v) => v.classes)
    .filter((c) => c.catalog_nbr === course.number);

  return allClasses;
}
