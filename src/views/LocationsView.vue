<template>
  <v-app>
    <app-bar />
    <v-main>
      <v-container fluid>
        <v-row class="mb-4">
          <v-col>
            <div class="d-flex justify-space-between align-center">
              <h1 class="text-h4">المواقع</h1>
              <v-btn @click="openDialog()" prepend-icon="mdi-plus">
                إضافة موقع
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-row v-if="locationsStore.loading" justify="center">
          <v-col cols="auto">
            <v-progress-circular indeterminate color="primary" />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col
            v-for="location in locationsStore.locations"
            :key="location.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              hover
              @click="goToExams(location.id)"
              class="location-card"
              elevation="4"
            >
              <v-card-title>{{ location.name }}</v-card-title>
              <v-card-subtitle>{{ location.slug }}</v-card-subtitle>
              <v-card-text v-if="location.description">
                {{ location.description }}
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click.stop="openDialog(location)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click.stop="deleteLocation(location)"
                />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ editMode ? 'تعديل الموقع' : 'إضافة موقع جديد' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef">
            <div class="mb-2">
              <span class="text-subtitle-2 font-weight-medium mb-1 d-block">اسم الموقع</span>
              <v-text-field
                v-model="formData.name"
                required
                :rules="[v => !!v || 'الاسم مطلوب']"
                placeholder="أدخل اسم الموقع"
              />
            </div>

            <div class="mb-2">
              <span class="text-subtitle-2 font-weight-medium mb-1 d-block">الاسم المختصر (Slug)</span>
              <v-text-field
                v-model="formData.slug"
                required
                :rules="[v => !!v || 'الاسم المختصر مطلوب']"
                placeholder="أدخل الاسم المختصر"
              />
            </div>

            <div class="mb-2">
              <span class="text-subtitle-2 font-weight-medium mb-1 d-block">الوصف</span>
              <v-textarea
                v-model="formData.description"
                rows="3"
                placeholder="أدخل وصف الموقع"
              />
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">إلغاء</v-btn>
          <v-btn @click="saveLocation" :loading="saving">
            حفظ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>تأكيد الحذف</v-card-title>
        <v-card-text>
          هل أنت متأكد من حذف هذا الموقع؟ سيتم حذف جميع الامتحانات المرتبطة به.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">إلغاء</v-btn>
          <v-btn color="error" @click="confirmDelete" :loading="deleting">
            حذف
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLocationsStore } from '@/stores/locations'
import type { Location } from '@/types/database.types'
import AppBar from '@/components/AppBar.vue'

const router = useRouter()
const route = useRoute()
const locationsStore = useLocationsStore()

const courseId = Number(route.params.courseId)

const dialog = ref(false)
const deleteDialog = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deleting = ref(false)
const formRef = ref()

const formData = ref<Partial<Location>>({
  course_id: courseId,
  name: '',
  slug: '',
  description: ''
})

const locationToDelete = ref<Location | null>(null)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

onMounted(async () => {
  await locationsStore.fetchLocationsByCourse(courseId)
})

function openDialog(location?: Location) {
  if (location) {
    editMode.value = true
    // Extract only the editable Location properties
    // Exclude: 'course' (join), 'id', 'created_at', 'updated_at' (readonly)
    formData.value = {
      id: location.id, // Keep id for reference in edit mode
      course_id: location.course_id,
      name: location.name,
      slug: location.slug,
      description: location.description
    }
  } else {
    editMode.value = false
    formData.value = {
      course_id: courseId,
      name: '',
      slug: '',
      description: ''
    }
  }
  dialog.value = true
}

async function saveLocation() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (editMode.value && formData.value.id) {
      // Extract only updatable fields (exclude id, created_at, updated_at)
      const { id, created_at, updated_at, ...updateData } = formData.value
      await locationsStore.updateLocation(formData.value.id, updateData)
      showSnackbar('تم تحديث الموقع بنجاح', 'success')
    } else {
      await locationsStore.createLocation(formData.value)
      showSnackbar('تم إضافة الموقع بنجاح', 'success')
    }
    dialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'حدث خطأ', 'error')
  } finally {
    saving.value = false
  }
}

function deleteLocation(location: Location) {
  locationToDelete.value = location
  deleteDialog.value = true
}

async function confirmDelete() {
  if (!locationToDelete.value) return

  deleting.value = true
  try {
    await locationsStore.deleteLocation(locationToDelete.value.id)
    showSnackbar('تم حذف الموقع بنجاح', 'success')
    deleteDialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'حدث خطأ', 'error')
  } finally {
    deleting.value = false
  }
}

function goToExams(locationId: number) {
  router.push({ name: 'exams', params: { locationId } })
}

function showSnackbar(text: string, color: string) {
  snackbar.value = { show: true, text, color }
}
</script>

<style scoped>
.location-card {
  cursor: pointer;
}
</style>
