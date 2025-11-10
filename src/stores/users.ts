import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/database.types'

export const useUsersStore = defineStore('users', () => {
  const users = ref<Profile[]>([])
  const loading = ref(false)

  async function fetchUsers() {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      users.value = data || []
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateUser(id: string, user: Partial<Profile>) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(user)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = data
      }
      return data
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    fetchUsers,
    updateUser
  }
})
