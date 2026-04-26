<template>
  <div class="login-page">
    <div class="decorations">
      <el-icon class="deco icon-1"><Reading /></el-icon>
      <el-icon class="deco icon-2"><Microphone /></el-icon>
      <el-icon class="deco icon-3"><Notebook /></el-icon>
      <el-icon class="deco icon-4"><Star /></el-icon>
      <el-icon class="deco icon-5"><Collection /></el-icon>
      <el-icon class="deco icon-6"><Sunny /></el-icon>
      <el-icon class="deco icon-7"><Reading /></el-icon>
      <el-icon class="deco icon-8"><Bell /></el-icon>
      <el-icon class="deco icon-9"><Guide /></el-icon>
      <el-icon class="deco icon-10"><Flag /></el-icon>
      <el-icon class="deco icon-11"><ChatDotRound /></el-icon>
      <el-icon class="deco icon-12"><Microphone /></el-icon>
    </div>

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
// Import ikon dekorasi
import { 
  Reading, Microphone, Notebook, Star, 
  Collection, Sunny, Bell, Guide, 
  Flag, ChatDotRound 
} from '@element-plus/icons-vue'

const router = useRouter()

// DATA LOGIN ASLI ANDA [cite: 7]
const form = reactive({
  username: 'muhammad.fikri@uin-suska.ac.id',
  password: 'muhammad.fikri'
})

// LOGIKA LOGIN ASLI ANDA (TIDAK DIUBAH) 
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
  background: #0f172a; /* Latar belakang gelap  */
  position: relative;
  overflow: hidden;
}

.login-card { 
  background: #1e293b; 
  padding: 40px; 
  border-radius: 12px; 
  width: 350px; 
  color: white;
  text-align: center;
  position: relative;
  z-index: 10; /* Memastikan kotak di depan ikon */
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

/* STYLING IKON KECIL DENGAN WARNA-WARNI */
.deco {
  position: absolute;
  opacity: 0.3; /* Transparansi agar tetap estetik tapi berwarna */
  font-size: 45px;
  z-index: 1;
}

/* Pengaturan Posisi dan Warna Spesifik */
.icon-1 { top: 8%; left: 6%; color: #fb923c; transform: rotate(15deg); } /* Oranye */
.icon-2 { top: 15%; right: 8%; color: #38bdf8; transform: rotate(-20deg); } /* Biru */
.icon-3 { bottom: 12%; left: 10%; color: #4ade80; font-size: 65px; } /* Hijau */
.icon-4 { bottom: 6%; right: 18%; color: #facc15; transform: rotate(12deg); } /* Kuning */
.icon-5 { top: 45%; left: 22%; color: #f87171; font-size: 35px; } /* Merah */
.icon-6 { bottom: 25%; right: 7%; color: #fbbf24; } /* Amber */
.icon-7 { top: 4%; right: 35%; color: #a78bfa; transform: rotate(-8deg); } /* Ungu */
.icon-8 { bottom: 40%; left: 4%; color: #f472b6; } /* Pink */
.icon-9 { top: 65%; left: 8%; color: #2dd4bf; font-size: 55px; } /* Teal */
.icon-10 { bottom: 55%; right: 12%; color: #60a5fa; } /* Biru Muda */
.icon-11 { top: 70%; right: 28%; color: #fb923c; font-size: 40px; } /* Oranye */
.icon-12 { top: 12%; left: 32%; color: #818cf8; opacity: 0.2; } /* Indigo */

h2 {
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
  text-align: center; /* Judul rata tengah [cite: 12] */
}

:deep(.el-form-item__label) {
  text-align: left;
  display: block;
  color: #cbd5e1;
}
</style>