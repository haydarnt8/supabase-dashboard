<template>
  <v-app>
    <app-bar />
    <v-main>
      <v-container fluid>
        <v-row class="mb-4">
          <v-col>
            <div class="d-flex justify-space-between align-center">
              <h1 class="text-h4">الامتحانات</h1>
              <v-btn @click="openDialog()" prepend-icon="mdi-plus">
                إضافة امتحان
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-row v-if="examsStore.loading" justify="center">
          <v-col cols="auto">
            <v-progress-circular indeterminate color="primary" />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col
            v-for="exam in examsStore.exams"
            :key="exam.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card elevation="4" class="exam-card">
              <v-card-title>{{ exam.name }}</v-card-title>

              <v-card-text>
                <v-chip
                  v-if="exam.number"
                  size="small"
                  class="mb-2"
                  color="primary"
                  prepend-icon="mdi-numeric"
                >
                  رقم: {{ exam.number }}
                </v-chip>

                <div v-if="exam.exam_date" class="mb-2">
                  <v-icon size="small">mdi-calendar</v-icon>
                  {{ formatDate(exam.exam_date) }}
                </div>

                <div v-if="exam.start_time && exam.end_time" class="mb-2">
                  <v-icon size="small">mdi-clock-outline</v-icon>
                  <span dir="ltr" class="d-inline-block">{{ formatTime(exam.start_time) }} - {{ formatTime(exam.end_time) }}</span>
                </div>

                <div v-if="exam.chapter" class="mb-2">
                  <strong>الفصل:</strong> {{ exam.chapter }}
                </div>

                <div v-if="exam.from_lecture || exam.to_lecture" class="mb-2">
                  <strong>المحاضرات:</strong>
                  {{ exam.from_lecture }} - {{ exam.to_lecture }}
                </div>

                <div v-if="exam.institution" class="mb-2">
                  <v-icon size="small">mdi-school</v-icon>
                  {{ exam.institution }}
                </div>

                <div v-if="exam.message" class="info-box mb-2">
                  <strong>رسالة:</strong> {{ exam.message }}
                </div>

                <div v-if="exam.note" class="note-box">
                  <strong>ملاحظة:</strong> {{ exam.note }}
                </div>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="openDialog(exam)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteExam(exam)"
                />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="800px" scrollable>
      <v-card>
        <v-card-title>
          {{ editMode ? 'تعديل الامتحان' : 'إضافة امتحان جديد' }}
        </v-card-title>

        <v-card-text style="max-height: 600px;">
          <v-form ref="formRef">
            <v-row>
              <v-col cols="12" md="6">
                <div class="mb-2">
                  <span class="text-subtitle-2 font-weight-medium mb-1 d-block">اسم الامتحان</span>
                  <v-text-field
                    v-model="formData.name"
                    required
                    :rules="[v => !!v || 'الاسم مطلوب']"
                    placeholder="أدخل اسم الامتحان"
                  />
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="mb-2">
                  <span class="text-subtitle-2 font-weight-medium mb-1 d-block">رقم الامتحان</span>
                  <v-text-field
                    v-model="formData.number"
                    placeholder="أدخل رقم الامتحان"
                  />
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <div class="mb-2">
                  <span class="text-subtitle-2 font-weight-medium mb-1 d-block">تاريخ الامتحان</span>
                  <v-text-field
                    v-model="formData.exam_date"
                    readonly
                    placeholder="اختر تاريخ الامتحان"
                    @click="datePickerOpen = true"
                  >
                    <template v-slot:append-inner>
                      <v-icon>mdi-calendar</v-icon>
                    </template>
                  </v-text-field>
                  <v-dialog v-model="datePickerOpen" max-width="400">
                    <v-date-picker
                      v-model="formData.exam_date"
                      @update:model-value="handleDateChange"
                    />
                  </v-dialog>
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <div class="mb-2">
                  <span class="text-subtitle-2 font-weight-medium mb-1 d-block">وقت البداية</span>
                  <v-text-field
                    v-model="formData.start_time"
                    readonly
                    placeholder="اختر وقت البداية"
                    @click="startTimePickerOpen = true"
                  >
                    <template v-slot:append-inner>
                      <v-icon>mdi-clock-outline</v-icon>
                    </template>
                  </v-text-field>
                  <v-dialog v-model="startTimePickerOpen" max-width="400">
                    <v-card>
                      <v-card-title class="text-center">اختر وقت البداية</v-card-title>
                      <v-card-text class="d-flex justify-center">
                        <v-time-picker
                          v-model="tempStartTime"
                          format="ampm"
                          color="primary"
                        />
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn variant="text" @click="startTimePickerOpen = false">إلغاء</v-btn>
                        <v-btn color="primary" @click="saveStartTime">حفظ</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <div class="mb-2">
                  <span class="text-subtitle-2 font-weight-medium mb-1 d-block">وقت النهاية</span>
                  <v-text-field
                    v-model="formData.end_time"
                    readonly
                    placeholder="اختر وقت النهاية"
                    @click="endTimePickerOpen = true"
                  >
                    <template v-slot:append-inner>
                      <v-icon>mdi-clock-outline</v-icon>
                    </template>
                  </v-text-field>
                  <v-dialog v-model="endTimePickerOpen" max-width="400">
                    <v-card>
                      <v-card-title class="text-center">اختر وقت النهاية</v-card-title>
                      <v-card-text class="d-flex justify-center">
                        <v-time-picker
                          v-model="tempEndTime"
                          format="ampm"
                          color="primary"
                        />
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn variant="text" @click="endTimePickerOpen = false">إلغاء</v-btn>
                        <v-btn color="primary" @click="saveEndTime">حفظ</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="mb-2">
                  <span class="text-subtitle-2 font-weight-medium mb-1 d-block">الفصل</span>
                  <v-text-field
                    v-model="formData.chapter"
                    placeholder="أدخل الفصل"
                  />
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="mb-2">
                  <span class="text-subtitle-2 font-weight-medium mb-1 d-block">المؤسسة</span>
                  <v-text-field
                    v-model="formData.institution"
                    placeholder="أدخل المؤسسة"
                  />
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="mb-2">
                  <span class="text-subtitle-2 font-weight-medium mb-1 d-block">من محاضرة</span>
                  <v-text-field
                    v-model="formData.from_lecture"
                    placeholder="أدخل رقم المحاضرة"
                  />
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="mb-2">
                  <span class="text-subtitle-2 font-weight-medium mb-1 d-block">إلى محاضرة</span>
                  <v-text-field
                    v-model="formData.to_lecture"
                    placeholder="أدخل رقم المحاضرة"
                  />
                </div>
              </v-col>

              <v-col cols="12">
                <div class="mb-2">
                  <span class="text-subtitle-2 font-weight-medium mb-1 d-block">رسالة</span>
                  <v-textarea
                    v-model="formData.message"
                    rows="2"
                    placeholder="أدخل الرسالة"
                  />
                </div>
              </v-col>

              <v-col cols="12">
                <div class="mb-2">
                  <span class="text-subtitle-2 font-weight-medium mb-1 d-block">ملاحظة</span>
                  <v-textarea
                    v-model="formData.note"
                    rows="2"
                    placeholder="أدخل الملاحظة"
                  />
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">إلغاء</v-btn>
          <v-btn @click="saveExam" :loading="saving">
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
          هل أنت متأكد من حذف هذا الامتحان؟
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
import { useRoute } from 'vue-router'
import { useExamsStore } from '@/stores/exams'
import type { Exam } from '@/types/database.types'
import AppBar from '@/components/AppBar.vue'

const route = useRoute()
const examsStore = useExamsStore()

const locationId = Number(route.params.locationId)

const dialog = ref(false)
const deleteDialog = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deleting = ref(false)
const formRef = ref()
const datePickerOpen = ref(false)
const startTimePickerOpen = ref(false)
const endTimePickerOpen = ref(false)
const tempStartTime = ref('')
const tempEndTime = ref('')

const formData = ref<Partial<Exam>>({
  location_id: locationId,
  name: '',
  number: '',
  exam_date: '',
  start_time: '',
  end_time: '',
  chapter: '',
  from_lecture: '',
  to_lecture: '',
  message: '',
  note: '',
  institution: ''
})

const examToDelete = ref<Exam | null>(null)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

onMounted(async () => {
  await examsStore.fetchExamsByLocation(locationId)
})

function openDialog(exam?: Exam) {
  if (exam) {
    editMode.value = true
    // Extract only editable properties (exclude 'location' join if present)
    const { location, ...examData } = exam as any
    formData.value = {
      id: examData.id,
      location_id: examData.location_id,
      name: examData.name,
      number: examData.number,
      exam_date: examData.exam_date,
      start_time: examData.start_time,
      end_time: examData.end_time,
      chapter: examData.chapter,
      from_lecture: examData.from_lecture,
      to_lecture: examData.to_lecture,
      message: examData.message,
      note: examData.note,
      institution: examData.institution
    }
    // Initialize temp time values
    tempStartTime.value = examData.start_time || ''
    tempEndTime.value = examData.end_time || ''
  } else {
    editMode.value = false
    formData.value = {
      location_id: locationId,
      name: '',
      number: '',
      exam_date: '',
      start_time: '',
      end_time: '',
      chapter: '',
      from_lecture: '',
      to_lecture: '',
      message: '',
      note: '',
      institution: ''
    }
    // Clear temp time values
    tempStartTime.value = ''
    tempEndTime.value = ''
  }
  dialog.value = true
}

async function saveExam() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (editMode.value && formData.value.id) {
      // Extract only updatable fields (exclude id, created_at, updated_at)
      const { id, created_at, updated_at, ...updateData } = formData.value
      await examsStore.updateExam(formData.value.id, updateData)
      showSnackbar('تم تحديث الامتحان بنجاح', 'success')
    } else {
      await examsStore.createExam(formData.value)
      showSnackbar('تم إضافة الامتحان بنجاح', 'success')
    }
    dialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'حدث خطأ', 'error')
  } finally {
    saving.value = false
  }
}

function deleteExam(exam: Exam) {
  examToDelete.value = exam
  deleteDialog.value = true
}

async function confirmDelete() {
  if (!examToDelete.value) return

  deleting.value = true
  try {
    await examsStore.deleteExam(examToDelete.value.id)
    showSnackbar('تم حذف الامتحان بنجاح', 'success')
    deleteDialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'حدث خطأ', 'error')
  } finally {
    deleting.value = false
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function formatTime(timeString: string) {
  if (!timeString) return ''
  // Parse time string (HH:MM:SS or HH:MM)
  const parts = timeString.split(':')
  const hours = parseInt(parts[0])
  const minutes = parseInt(parts[1])

  // Convert to 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12

  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
}

function handleDateChange(date: Date | string | null) {
  if (!date) {
    datePickerOpen.value = false
    return
  }

  if (date instanceof Date) {
    // Convert Date object to YYYY-MM-DD format using local timezone
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    formData.value.exam_date = `${year}-${month}-${day}`
  } else {
    formData.value.exam_date = date
  }
  datePickerOpen.value = false
}

function saveStartTime() {
  formData.value.start_time = tempStartTime.value
  startTimePickerOpen.value = false
}

function saveEndTime() {
  formData.value.end_time = tempEndTime.value
  endTimePickerOpen.value = false
}

function showSnackbar(text: string, color: string) {
  snackbar.value = { show: true, text, color }
}
</script>

<style scoped>
.exam-card {
  height: 100%;
}

.info-box {
  padding: 8px 12px;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 6px;
  border-right: 3px solid #06B6D4;
  font-size: 0.875rem;
}

.note-box {
  padding: 8px 12px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 6px;
  border-right: 3px solid #F59E0B;
  font-size: 0.875rem;
}

.v-theme--dark .info-box {
  background: rgba(6, 182, 212, 0.15);
}

.v-theme--dark .note-box {
  background: rgba(245, 158, 11, 0.15);
}

.v-theme--light .info-box {
  background: rgba(6, 182, 212, 0.08);
}

.v-theme--light .note-box {
  background: rgba(245, 158, 11, 0.08);
}
</style>
