export const dummyData = {
    courses: {
        'course-1': { id: 'course-1', name: 'CSE 1' },
        'course-2': { id: 'course-2', name: 'CSE 2' },
        'course-3': { id: 'course-3', name: 'CSE 3' },
        'course-4': { id: 'course-4', name: 'CSE 4' },
        'course-5': { id: 'course-5', name: 'CSE 5' },
        'course-6': { id: 'course-6', name: 'CSE 6' },
    },
    quarters: {
        'quarter-1': {
            id: 'quarter-1',
            title: 'Fall',
            courseIds: ['course-1', 'course-2', 'course-3', 'course-4', 'course-5', 'course-6']
            // courseIds: []
        },
        'quarter-2': {
            id: 'quarter-2',
            title: 'Winter',
            courseIds: []
        },
        'quarter-3': {
            id: 'quarter-3',
            title: 'Spring',
            courseIds: []
        },
    },
    quarterOrder: ['quarter-1', 'quarter-2', 'quarter-3'],
}