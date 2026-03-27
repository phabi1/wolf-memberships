export type Lesson = {
    id: number;
    title: string;
    day: number;
    lesson_start: number;
    lesson_end: number;
    age_min?: number;
    age_max?: number;
    participant_max?: number; 
}