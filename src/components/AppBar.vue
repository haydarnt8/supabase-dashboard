<template>
  <v-app-bar elevation="0" class="app-header">
    <v-app-bar-title class="text-white font-weight-bold">
      <v-icon class="ml-2" color="white" size="large">mdi-school</v-icon>
      لوحة التحكم
    </v-app-bar-title>

    <v-spacer />

    <!-- Breadcrumb Navigation -->
    <v-breadcrumbs v-if="breadcrumbs.length > 0" :items="breadcrumbs" class="pa-0 breadcrumbs-custom">
      <template v-slot:divider>
        <v-icon color="white" size="small">mdi-chevron-left</v-icon>
      </template>
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          :to="item.to"
          :disabled="item.disabled"
          class="text-white breadcrumb-item"
        >
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>

    <v-spacer />

    <!-- Theme Toggle -->
    <v-btn icon variant="text" @click="toggleTheme" class="mx-1">
      <v-icon color="white">{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>

    <!-- Users Management Link -->
    <v-btn
      v-if="route.name !== 'users'"
      :to="{ name: 'users' }"
      variant="text"
      class="text-white mx-1"
    >
      <v-icon class="ml-1" color="white">mdi-account-group</v-icon>
      المستخدمين
    </v-btn>

    <!-- Back to Courses -->
    <v-btn
      v-if="route.name !== 'courses'"
      :to="{ name: 'courses' }"
      variant="text"
      class="text-white mx-1"
    >
      <v-icon class="ml-1" color="white">mdi-home</v-icon>
      الرئيسية
    </v-btn>

    <!-- Logout Button -->
    <v-btn
      variant="text"
      @click="handleLogout"
      :loading="loading"
      class="text-white mx-1"
    >
      <v-icon class="ml-1" color="white">mdi-logout</v-icon>
      خروج
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import { useCoursesStore } from '@/stores/courses'
import { useLocationsStore } from '@/stores/locations'

const router = useRouter()
const route = useRoute()
const theme = useTheme()
const authStore = useAuthStore()
const coursesStore = useCoursesStore()
const locationsStore = useLocationsStore()

const loading = ref(false)

const breadcrumbs = computed(() => {
  const crumbs: Array<{ title: string; to?: any; disabled?: boolean }> = []

  if (route.name === 'locations' && route.params.courseId) {
    const course = coursesStore.courses.find(c => c.id === Number(route.params.courseId))
    if (course) {
      crumbs.push({ title: course.name, disabled: true })
    }
  }

  if (route.name === 'exams' && route.params.locationId) {
    const location = locationsStore.locations.find(l => l.id === Number(route.params.locationId))
    if (location) {
      if (location.course) {
        crumbs.push({
          title: location.course.name,
          to: { name: 'locations', params: { courseId: location.course_id } }
        })
      }
      crumbs.push({ title: location.name, disabled: true })
    }
  }

  return crumbs
})

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

async function handleLogout() {
  loading.value = true
  try {
    await authStore.signOut()
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Error logging out:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.app-header {
  background: #0EA5E9 !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.app-header .v-toolbar__content {
  color: white !important;
}

.app-header .v-btn {
  color: white !important;
}

.app-header .v-icon {
  color: white !important;
}

.breadcrumbs-custom {
  color: white !important;
}
</style>
