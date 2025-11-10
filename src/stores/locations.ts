import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Location, LocationWithCourse } from '@/types/database.types'

export const useLocationsStore = defineStore('locations', () => {
  const locations = ref<LocationWithCourse[]>([])
  const loading = ref(false)

  async function fetchLocationsByCourse(courseId: number) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*, course:courses(*)')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })

      if (error) throw error
      locations.value = data || []
    } catch (error) {
      console.error('Error fetching locations:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createLocation(location: Partial<Location>) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert([location])
        .select('*, course:courses(*)')
        .single()

      if (error) throw error
      locations.value.unshift(data)
      return data
    } catch (error) {
      console.error('Error creating location:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateLocation(id: number, location: Partial<Location>) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('locations')
        .update(location)
        .eq('id', id)
        .select('*, course:courses(*)')
        .single()

      if (error) throw error

      const index = locations.value.findIndex(l => l.id === id)
      if (index !== -1) {
        locations.value[index] = data
      }
      return data
    } catch (error) {
      console.error('Error updating location:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteLocation(id: number) {
    loading.value = true
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id)

      if (error) throw error

      locations.value = locations.value.filter(l => l.id !== id)
    } catch (error) {
      console.error('Error deleting location:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    locations,
    loading,
    fetchLocationsByCourse,
    createLocation,
    updateLocation,
    deleteLocation
  }
})
