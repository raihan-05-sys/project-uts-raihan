<template>
  <div class="login-page">
    <div class="login-card">
      <h2>LOGIN DOSEN</h2>
      <el-form label-position="top">
        <el-form-item label="Username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-button type="primary" @click="handleLogin" style="width: 100%">MASUK</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = reactive({
  username: 'muhammad.fikri@uin-suska.ac.id',
  password: 'muhammad.fikri'
})

const handleLogin = async () => {
  try {
    const params = new URLSearchParams({
      client_id: 'setoran-mobile-dev',
      client_secret: 'aqJp3xnXKudgC7RMOshEQP7ZoVKWzoSl',
      grant_type: 'password',
      scope: 'openid profile email',
      username: form.username,
      password: form.password
    })
    const res = await axios.post('https://id.tif.uin-suska.ac.id/realms/dev/protocol/openid-connect/token', params)
    localStorage.setItem('auth-token', res.data.access_token)
    router.push('/dashboard')
  } catch (err) {
    ElMessage.error('Login Gagal!')
  }
}
</script>

<style scoped>
.login-page { 
  height: 100vh; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  background: #0f172a; /* Latar belakang gelap sesuai permintaan [cite: 4] */
}

.login-card { 
  background: #1e293b; 
  padding: 40px; 
  border-radius: 12px; 
  width: 350px; 
  color: white;
  /* Tambahkan ini agar semua konten di dalam kotak, termasuk judul, menjadi rata tengah */
  text-align: center; 
}

h2 {
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
  /* Memastikan teks judul benar-benar di tengah  */
  text-align: center; 
}

/* Mengatur label form agar tetap rata di kiri supaya rapi */
:deep(.el-form-item__label) {
  text-align: left;
  display: block;
  color: #cbd5e1;
}
</style>