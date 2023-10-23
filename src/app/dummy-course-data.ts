import { Quarter } from './ts-types/Quarter'
import { DummyData } from './ts-types/DummyData';

const quarterNames = ["Fall", "Winter", "Spring", "Summer"];
const yearNames = ["Freshman", "Sophomore", "Junior", "Senior"];
const years = 4;
const quartersPerYear = 4;

export const dummyData: DummyData = {
    courses: createCourses(),
    quarters: createQuarters().quarters,
    quarterOrder: createQuarters().quarterOrder,
    years,
    quartersPerYear,
}

function createCourses() {
    // return {
    //     'course-1': { id: 'course-1', name: 'CSE 1' },
    // }
    return {}
}

function createQuarters() {
    const quarters: { [key: string]: Quarter } = {};
    const quarterOrder: string[] = [];

    for (let year = 0; year < years; year++) {
        for (let quarter = 0; quarter < quartersPerYear; quarter++) {
            const quarterId = `quarter-${year}-${quarter}`;
            quarters[quarterId] = {
                id: quarterId,
                title: `${quarterNames[quarter]} ${yearNames[year]}`,
                courseIds: []
            }
            quarterOrder.push(quarterId);
        }
    }

    // add courses to first quarter
    const courses = createCourses();
    Object.keys(courses).forEach((courseId) => {
        const quarterId = quarterOrder[0];
        quarters[quarterId].courseIds.push(courseId);
    });

    return { quarters, quarterOrder };
}