export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: number
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Location {
  id: number
  course_id: number
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Exam {
  id: number
  location_id: number
  name: string
  number: string | null
  exam_date: string | null
  start_time: string | null
  end_time: string | null
  chapter: string | null
  from_lecture: string | null
  to_lecture: string | null
  message: string | null
  note: string | null
  institution: string | null
  created_at: string
  updated_at: string
}

export interface LocationWithCourse extends Location {
  course?: Course
}

export interface ExamWithLocation extends Exam {
  location?: LocationWithCourse
}
