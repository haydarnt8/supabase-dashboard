import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Exam, ExamWithLocation } from '@/types/database.types'

export const useExamsStore = defineStore('exams', () => {
  const exams = ref<ExamWithLocation[]>([])
  const loading = ref(false)

  async function fetchExamsByLocation(locationId: number) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*, location:locations(*, course:courses(*))')
        .eq('location_id', locationId)
        .order('created_at', { ascending: false })

      if (error) throw error
      exams.value = data || []
    } catch (error) {
      console.error('Error fetching exams:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createExam(exam: Partial<Exam>) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('exams')
        .insert([exam])
        .select('*, location:locations(*, course:courses(*))')
        .single()

      if (error) throw error
      exams.value.unshift(data)
      return data
    } catch (error) {
      console.error('Error creating exam:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateExam(id: number, exam: Partial<Exam>) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('exams')
        .update(exam)
        .eq('id', id)
        .select('*, location:locations(*, course:courses(*))')
        .single()

      if (error) throw error

      const index = exams.value.findIndex(e => e.id === id)
      if (index !== -1) {
        exams.value[index] = data
      }
      return data
    } catch (error) {
      console.error('Error updating exam:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteExam(id: number) {
    loading.value = true
    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id)

      if (error) throw error

      exams.value = exams.value.filter(e => e.id !== id)
    } catch (error) {
      console.error('Error deleting exam:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    exams,
    loading,
    fetchExamsByLocation,
    createExam,
    updateExam,
    deleteExam
  }
})
