<template>
  <v-app>
    <v-main class="login-main">
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4" lg="3">
            <div class="text-center mb-8">
              <v-icon size="64" color="primary" class="mb-4">mdi-school</v-icon>
              <h1 class="text-h4 font-weight-bold mb-2">لوحة التحكم</h1>
              <p class="text-subtitle-1 text-medium-emphasis">نظام إدارة الامتحانات</p>
            </div>

            <v-card elevation="2" class="login-card">
              <v-card-title class="text-h5 text-center pa-6 font-weight-bold">
                تسجيل الدخول
              </v-card-title>

              <v-card-text class="px-6 pb-6">
                <v-form @submit.prevent="handleLogin">
                  <div class="mb-2">
                    <span class="text-subtitle-2 font-weight-medium mb-1 d-block">البريد الإلكتروني</span>
                    <v-text-field
                      v-model="email"
                      type="email"
                      prepend-inner-icon="mdi-email"
                      required
                      :error-messages="errors.email"
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>

                  <div class="mb-4">
                    <span class="text-subtitle-2 font-weight-medium mb-1 d-block">كلمة المرور</span>
                    <v-text-field
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-lock"
                      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append-inner="showPassword = !showPassword"
                      required
                      :error-messages="errors.password"
                      placeholder="أدخل كلمة المرور"
                    />
                  </div>

                  <v-alert
                    v-if="error"
                    type="error"
                    class="mb-4"
                  >
                    {{ error }}
                  </v-alert>

                  <v-btn
                    type="submit"
                    size="large"
                    block
                    :loading="loading"
                    class="mb-2"
                  >
                    دخول
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const errors = ref<{ email?: string; password?: string }>({})

async function handleLogin() {
  errors.value = {}
  error.value = ''

  // Validation
  if (!email.value) {
    errors.value.email = 'البريد الإلكتروني مطلوب'
    return
  }
  if (!password.value) {
    errors.value.password = 'كلمة المرور مطلوبة'
    return
  }

  loading.value = true
  try {
    await authStore.signIn(email.value, password.value)
    router.push({ name: 'courses' })
  } catch (err: any) {
    error.value = err.message || 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-main {
  background: linear-gradient(135deg, #0A1628 0%, #132337 100%);
}

.login-card {
  backdrop-filter: blur(10px);
}

.v-theme--light .login-main {
  background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
}
</style>
