import { Course } from './Course'
import { Quarter } from './Quarter'

export interface DummyData {
    courses: { [key: string]: Course }
    quarters: { [key: string]: Quarter }
    quarterOrder: string[]
    years: number
    quartersPerYear: number
}