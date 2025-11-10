<template>
  <v-app>
    <app-bar />
    <v-main>
      <v-container fluid>
        <v-row class="mb-4">
          <v-col>
            <div class="d-flex justify-space-between align-center">
              <h1 class="text-h4">الدورات</h1>
              <v-btn @click="openDialog()" prepend-icon="mdi-plus">
                إضافة دورة
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-row v-if="coursesStore.loading" justify="center">
          <v-col cols="auto">
            <v-progress-circular indeterminate color="primary" />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col
            v-for="course in coursesStore.courses"
            :key="course.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              hover
              @click="goToLocations(course.id)"
              class="course-card"
              elevation="4"
            >
              <v-card-title>{{ course.name }}</v-card-title>
              <v-card-subtitle>{{ course.slug }}</v-card-subtitle>
              <v-card-text v-if="course.description">
                {{ course.description }}
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click.stop="openDialog(course)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click.stop="deleteCourse(course)"
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
          {{ editMode ? 'تعديل الدورة' : 'إضافة دورة جديدة' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef">
            <div class="mb-2">
              <span class="text-subtitle-2 font-weight-medium mb-1 d-block">اسم الدورة</span>
              <v-text-field
                v-model="formData.name"
                required
                :rules="[v => !!v || 'الاسم مطلوب']"
                placeholder="أدخل اسم الدورة"
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
                placeholder="أدخل وصف الدورة"
              />
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">إلغاء</v-btn>
          <v-btn @click="saveCourse" :loading="saving">
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
          هل أنت متأكد من حذف هذه الدورة؟ سيتم حذف جميع المواقع والامتحانات المرتبطة بها.
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
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import type { Course } from '@/types/database.types'
import AppBar from '@/components/AppBar.vue'

const router = useRouter()
const coursesStore = useCoursesStore()

const dialog = ref(false)
const deleteDialog = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deleting = ref(false)
const formRef = ref()

const formData = ref<Partial<Course>>({
  name: '',
  slug: '',
  description: ''
})

const courseToDelete = ref<Course | null>(null)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

onMounted(async () => {
  await coursesStore.fetchCourses()
})

function openDialog(course?: Course) {
  if (course) {
    editMode.value = true
    // Extract only editable properties
    formData.value = {
      id: course.id,
      name: course.name,
      slug: course.slug,
      description: course.description
    }
  } else {
    editMode.value = false
    formData.value = {
      name: '',
      slug: '',
      description: ''
    }
  }
  dialog.value = true
}

async function saveCourse() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (editMode.value && formData.value.id) {
      // Extract only updatable fields (exclude id, created_at, updated_at)
      const { id, created_at, updated_at, ...updateData } = formData.value
      await coursesStore.updateCourse(formData.value.id, updateData)
      showSnackbar('تم تحديث الدورة بنجاح', 'success')
    } else {
      await coursesStore.createCourse(formData.value)
      showSnackbar('تم إضافة الدورة بنجاح', 'success')
    }
    dialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'حدث خطأ', 'error')
  } finally {
    saving.value = false
  }
}

function deleteCourse(course: Course) {
  courseToDelete.value = course
  deleteDialog.value = true
}

async function confirmDelete() {
  if (!courseToDelete.value) return

  deleting.value = true
  try {
    await coursesStore.deleteCourse(courseToDelete.value.id)
    showSnackbar('تم حذف الدورة بنجاح', 'success')
    deleteDialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'حدث خطأ', 'error')
  } finally {
    deleting.value = false
  }
}

function goToLocations(courseId: number) {
  router.push({ name: 'locations', params: { courseId } })
}

function showSnackbar(text: string, color: string) {
  snackbar.value = { show: true, text, color }
}
</script>

<style scoped>
.course-card {
  cursor: pointer;
}
</style>
