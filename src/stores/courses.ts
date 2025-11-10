import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types/database.types'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref<Course[]>([])
  const loading = ref(false)

  async function fetchCourses() {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      courses.value = data || []
    } catch (error) {
      console.error('Error fetching courses:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createCourse(course: Partial<Course>) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([course])
        .select()
        .single()

      if (error) throw error
      courses.value.unshift(data)
      return data
    } catch (error) {
      console.error('Error creating course:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateCourse(id: number, course: Partial<Course>) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(course)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const index = courses.value.findIndex(c => c.id === id)
      if (index !== -1) {
        courses.value[index] = data
      }
      return data
    } catch (error) {
      console.error('Error updating course:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteCourse(id: number) {
    loading.value = true
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)

      if (error) throw error

      courses.value = courses.value.filter(c => c.id !== id)
    } catch (error) {
      console.error('Error deleting course:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    loading,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse
  }
})
