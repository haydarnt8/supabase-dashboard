<template>
  <v-app>
    <app-bar />
    <v-main>
      <v-container fluid>
        <v-row class="mb-4">
          <v-col>
            <h1 class="text-h4">إدارة المستخدمين</h1>
          </v-col>
        </v-row>

        <v-row v-if="usersStore.loading" justify="center">
          <v-col cols="auto">
            <v-progress-circular indeterminate color="primary" />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <v-card elevation="2">
              <v-card-title>
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="البحث"
                  single-line
                  hide-details
                  variant="outlined"
                  density="compact"
                />
              </v-card-title>

              <v-data-table
                :headers="headers"
                :items="usersStore.users"
                :search="search"
                hide-default-footer
                class="elevation-0"
                items-per-page="10"
              >
                <template v-slot:item.created_at="{ item }">
                  {{ formatDate(item.created_at) }}
                </template>

                <template v-slot:item.updated_at="{ item }">
                  {{ formatDate(item.updated_at) }}
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-btn
                    icon
                    size="small"
                    @click="openDialog(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>تعديل المستخدم</v-card-title>

        <v-card-text>
          <v-form ref="formRef">
            <v-text-field
              v-model="formData.email"
              label="البريد الإلكتروني"
              variant="outlined"
              disabled
              readonly
            />

            <v-text-field
              v-model="formData.full_name"
              label="الاسم الكامل"
              variant="outlined"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">إلغاء</v-btn>
          <v-btn color="primary" @click="saveUser" :loading="saving">
            حفظ
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
import { useUsersStore } from '@/stores/users'
import type { Profile } from '@/types/database.types'
import AppBar from '@/components/AppBar.vue'

const usersStore = useUsersStore()

const search = ref('')
const dialog = ref(false)
const saving = ref(false)
const formRef = ref()

const headers = [
  { title: 'البريد الإلكتروني', key: 'email', align: 'start' },
  { title: 'الاسم الكامل', key: 'full_name' },
  { title: 'تاريخ الإنشاء', key: 'created_at' },
  { title: 'آخر تحديث', key: 'updated_at' },
  { title: 'الإجراءات', key: 'actions', sortable: false, align: 'center' }
] as const

const formData = ref<Partial<Profile>>({
  id: '',
  email: '',
  full_name: ''
})

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

onMounted(async () => {
  await usersStore.fetchUsers()
})

function openDialog(user: Profile) {
  formData.value = { ...user }
  dialog.value = true
}

async function saveUser() {
  if (!formData.value.id) return

  saving.value = true
  try {
    await usersStore.updateUser(formData.value.id, {
      full_name: formData.value.full_name
    })
    showSnackbar('تم تحديث المستخدم بنجاح', 'success')
    dialog.value = false
  } catch (error: any) {
    showSnackbar(error.message || 'حدث خطأ', 'error')
  } finally {
    saving.value = false
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function showSnackbar(text: string, color: string) {
  snackbar.value = { show: true, text, color }
}
</script>
