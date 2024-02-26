"use server";

import { terms } from "@/lib/consts";
import { z } from "zod";

import { StoredCourse } from "../types/Course";
import { Term } from "../types/Quarter";

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

const termEnrollmentSchema = z.object({
  classes: z.array(classInfoSchema),
});

type TermEnrollmentInfo = z.infer<typeof termEnrollmentSchema>[];

// getPastEnrollmentInfo returns the quarters offered and the professors who taught a course
// in past quarters
export async function getPastEnrollmentInfo(course: CourseEnrollQuery) {
  const pastQuarters = getPastQuarters();
  const pastOfferings = await Promise.all(
    pastQuarters.map(({ id }) =>
      fetch(createEnrollmentInfoURL(id, course)).then((res) => res.json()),
    ),
  ).then((offers) => {
    // Get the term and instructors for each time the course was offered previously
    return filterOfferings(offers, course).map((c) => ({
      term: getTermById(c.strm),
      instructors: c.instructors.flatMap((inst: Instructor) => inst.name),
    }));
  });
  pastOfferings.sort((a, b) =>
    a.term.catalogYear.localeCompare(b.term.catalogYear),
  );
  return pastOfferings;
}

// getFutureEnrollmentInfo returns current and future enrollment information about a particular
// course
export async function getFutureEnrollmentInfo(course: CourseEnrollQuery) {
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
      instructors: c.instructors.flatMap((inst: Instructor) => inst.name),
      class_section: c.class_section,
      component: c.component,
      start_time: c.start_time,
      end_time: c.end_time,
      location: c.location,
      meeting_days: c.meeting_days,
      enrl_status: c.enrl_status,
      waitlist_total: c.waitlist_total,
      enrl_capacity: c.enrl_capacity,
      enrl_total: c.enrl_total,
    }));
  });
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

function filterOfferings(offers: any[], course: CourseEnrollQuery) {
  // Filter offerings because sometimes a course is not offered
  // in a particular quarter. We do this using zod to safely parse
  const terms: TermEnrollmentInfo = offers.filter(
    (off) => termEnrollmentSchema.safeParse(off).success,
  );
  // Only get the offerings that match the course number
  const allClasses: ClassInfo[] = terms
    .flatMap((v) => v.classes)
    .filter((c) => c.catalog_nbr === course.number);

  return allClasses;
}
