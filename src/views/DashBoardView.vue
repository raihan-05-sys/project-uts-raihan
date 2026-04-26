<template>
  <div class="dashboard-container">
    <div class="glass-card">
      <div class="header-section">
        <div class="title-info">
          <h2 class="title-text">Manajemen Setoran Hafalan</h2>
          <p v-if="dosenInfo.nama" class="dosen-text">Dosen Pembimbing: {{ dosenInfo.nama }}</p>
        </div>
        <el-button type="danger" @click="handleLogout" size="small" plain>Logout</el-button>
      </div>

      <el-table :data="mahasiswa" v-loading="loading" class="custom-table">
        <el-table-column prop="nim" label="NIM" width="140" />
        <el-table-column prop="nama" label="Nama Mahasiswa" />
        <el-table-column label="Aksi" width="180" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" icon="View" circle @click="viewDetail(scope.row)" />
            <el-button type="success" size="small" icon="Plus" circle @click="handleSave(scope.row)" />
            <el-button type="danger" size="small" icon="Delete" circle @click="openDeleteModal(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="Detail Capaian Mahasiswa" width="700px" custom-class="custom-dialog">
      <div v-if="detailData.setoran" class="modal-body">
        <div class="user-header">
          <div class="avatar">{{ detailData.nama?.charAt(0) || 'U' }}</div>
          <div class="user-detail">
            <h3>{{ detailData.nama }}</h3>
            <p>{{ detailData.nim }} | Angkatan {{ detailData.angkatan }}</p>
            <p style="margin-top: 3px;">{{ detailData.email }} | Teknik Informatika</p>
          </div>
        </div>

        <div class="content-grid">
          <div class="progress-container">
            <h4 class="sub-title">Progres Hafalan</h4>
            <el-progress type="dashboard" :percentage="detailData.setoran.total_persen" :color="colors" :width="130" :stroke-width="12" />
            <div class="stats-list">
              <div class="stat-item"><span class="dot green"></span>Selesai: <strong>{{ detailData.setoran.total_selesai }}</strong></div>
              <div class="stat-item"><span class="dot gray"></span>Belum: <strong>{{ detailData.setoran.total_belum }}</strong></div>
            </div>
          </div>
          <div class="table-container">
            <h4 class="sub-title">Riwayat Aktivitas</h4>
            <el-table :data="detailData.setoran.detail" height="250" class="mini-table">
              <el-table-column prop="nama" label="Surah" />
              <el-table-column label="Status" width="100" align="center">
                <template #default="scope">
                  <el-tag :type="scope.row.sudah_setor ? 'success' : 'info'" size="small" effect="light">
                    {{ scope.row.sudah_setor ? 'Selesai' : 'Belum' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="dialogAddVisible" width="500px" custom-class="custom-dialog" :show-close="false">
      <template #header="{ close }">
        <div class="dialog-custom-header">
          <h3>🚀 Tambah Setoran Muroja'ah</h3>
          <el-button link icon="Close" @click="close" />
        </div>
      </template>

      <div class="student-info-card">
        <div class="avatar-small">
          <el-icon><User /></el-icon>
        </div>
        <div class="student-text">
          <span class="lbl-menyetorkan">Menambahkan setoran untuk:</span>
          <strong>{{ selectedNama }} ({{ selectedNim }})</strong>
        </div>
      </div>

      <el-form label-position="top" class="form-setoran" v-loading="isLoadingSurah">
        <el-form-item label="📚 Pilih Surah yang Ingin Disetor">
          <el-select 
            v-model="selectedSurahs" 
            value-key="id_komponen_setoran" 
            multiple 
            collapse-tags
            collapse-tags-tooltip
            placeholder="Pilih surah (hanya menampilkan yang belum disetor)..." 
            style="width: 100%"
          >
            <el-option 
              v-for="item in listSurah" 
              :key="item.id_komponen_setoran" 
              :label="item.nama_arab ? `${item.nama_komponen_setoran} (${item.nama_arab})` : item.nama_komponen_setoran" 
              :value="item" 
            >
              <span style="float: left">{{ item.nama_komponen_setoran }}</span>
              <span style="float: right; color: #8492a6; font-size: 14px; font-family: 'Amiri', serif;">{{ item.nama_arab }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="📅 Tanggal Setoran">
          <el-date-picker 
            v-model="tglSetoran" 
            type="date" 
            placeholder="Pilih Tanggal" 
            format="DD MMMM YYYY" 
            value-format="YYYY-MM-DD" 
            style="width: 100%" 
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogAddVisible = false" plain>Batal</el-button>
          <el-button type="primary" @click="submitSave" :loading="isSubmitting" icon="Check" :disabled="isLoadingSurah">
            Simpan Setoran
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogDeleteVisible" width="500px" custom-class="custom-dialog" :show-close="false">
      <template #header="{ close }">
        <div class="dialog-custom-header" style="border-bottom-color: #fecaca;">
          <h3 style="color: #dc2626;">🗑️ Batalkan Setoran Muroja'ah</h3>
          <el-button link icon="Close" @click="close" />
        </div>
      </template>

      <div class="student-info-card" style="background: #fef2f2; border-color: #fecaca;">
        <div class="avatar-small" style="background: #ef4444;">
          <el-icon><User /></el-icon>
        </div>
        <div class="student-text">
          <span class="lbl-menyetorkan">Membatalkan setoran atas nama:</span>
          <strong>{{ selectedNama }} ({{ selectedNim }})</strong>
        </div>
      </div>

      <el-form label-position="top" class="form-setoran" v-loading="isLoadingSurah">
        <el-form-item label="Pilih Surah yang Ingin Dibatalkan">
          <el-select 
            v-model="selectedForDelete" 
            value-key="id" 
            multiple 
            collapse-tags
            placeholder="Pilih surah yang sudah divalidasi..." 
            style="width: 100%"
          >
            <el-option 
              v-for="item in deletableSurahs" 
              :key="item.id" 
              :label="item.nama_arab ? `${item.nama_komponen_setoran} (${item.nama_arab})` : item.nama_komponen_setoran" 
              :value="item" 
            >
              <span style="float: left">{{ item.nama_komponen_setoran }}</span>
              <span style="float: right; color: #8492a6; font-size: 14px; font-family: 'Amiri', serif;">{{ item.nama_arab }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <p style="font-size: 12px; color: #ef4444; margin-top: -10px;">
          *Data yang dibatalkan akan dikembalikan statusnya menjadi belum disetor.
        </p>
      </el-form>

      <template #footer>
        <div class="dialog-footer" style="text-align: right;">
          <el-button @click="dialogDeleteVisible = false" plain>Tutup</el-button>
          <el-button type="danger" @click="submitDelete" :loading="isDeleting" icon="Delete" :disabled="isLoadingSurah">
            Hapus Terpilih
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../services/api' // Path harus benar

const router = useRouter()
const mahasiswa = ref([])
const dosenInfo = ref({})
const loading = ref(false)
const dialogVisible = ref(false)
const detailData = ref({})

// --- STATE FORM TAMBAH & HAPUS ---
const dialogAddVisible = ref(false)
const dialogDeleteVisible = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const isLoadingSurah = ref(false)

const selectedNim = ref(null)
const selectedNama = ref('')
const selectedSurahs = ref([])
const tglSetoran = ref('')

const listSurah = ref([]) 
const deletableSurahs = ref([]) 
const selectedForDelete = ref([]) 

const arabicNames = {
  'SURAH_1': 'الفاتحة',
  'SURAH_78': 'النبأ', 'SURAH_79': 'النازعات', 'SURAH_80': 'عبس',
  'SURAH_81': 'التكوير', 'SURAH_82': 'الانفطار', 'SURAH_83': 'المطففين',
  'SURAH_84': 'الانشقاق', 'SURAH_85': 'البروج', 'SURAH_86': 'الطارق',
  'SURAH_87': 'الأعلى', 'SURAH_88': 'الغاشية', 'SURAH_89': 'الفجر',
  'SURAH_90': 'البلد', 'SURAH_91': 'الشمس', 'SURAH_92': 'الليل',
  'SURAH_93': 'الضحى', 'SURAH_94': 'الشرح', 'SURAH_95': 'التين',
  'SURAH_96': 'العلق', 'SURAH_97': 'القدر', 'SURAH_98': 'البينة',
  'SURAH_99': 'الزلزلة', 'SURAH_100': 'العاديات', 'SURAH_101': 'القارعة',
  'SURAH_102': 'التكاثر', 'SURAH_103': 'العصر', 'SURAH_104': 'الهمزة',
  'SURAH_105': 'الفيل', 'SURAH_106': 'قريش', 'SURAH_107': 'الماعون',
  'SURAH_108': 'الكوثر', 'SURAH_109': 'الكافرون', 'SURAH_110': 'النصر',
  'SURAH_111': 'المسد', 'SURAH_112': 'الإخلاص', 'SURAH_113': 'الفلق',
  'SURAH_114': 'الناس'
}

const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

const loadDashboardData = async () => {
  loading.value = true
  try {
    const res = await api.get('/dosen/pa-saya')
    if (res.data.data) {
      dosenInfo.value = { nama: res.data.data.nama }
      mahasiswa.value = res.data.data.info_mahasiswa_pa.daftar_mahasiswa
    }
  } catch (err) {
    ElMessage.error('Sesi berakhir atau gagal ambil data mahasiswa')
  } finally { loading.value = false }
}

const viewDetail = async (mhs) => {
  try {
    const res = await api.get(`/mahasiswa/setoran/${mhs.nim}`)
    const detailList = res.data.data.setoran.detail || []
    
    const hitungSelesai = detailList.filter(item => item.sudah_setor === true).length
    const hitungBelum = detailList.filter(item => item.sudah_setor === false).length
    const totalSurah = detailList.length
    const hitungPersen = totalSurah > 0 ? Math.round((hitungSelesai / totalSurah) * 100) : 0

    const tahunAngkatan = mhs.nim ? '20' + String(mhs.nim).substring(1, 3) : '-'
    
    detailData.value = {
      ...res.data.data,
      nama: mhs.nama,
      nim: mhs.nim,
      email: mhs.email || `${mhs.nim}@students.uin-suska.ac.id`,
      angkatan: mhs.angkatan || tahunAngkatan,
      setoran: {
        ...res.data.data.setoran,
        total_selesai: hitungSelesai,
        total_belum: hitungBelum,
        total_persen: hitungPersen
      }
    }
    dialogVisible.value = true
  } catch (err) { 
    ElMessage.error('Gagal memuat detail setoran mahasiswa') 
  }
}

const handleSave = async (mhs) => {
  selectedNim.value = mhs.nim
  selectedNama.value = mhs.nama
  selectedSurahs.value = []
  tglSetoran.value = new Date().toISOString().split('T')[0]
  dialogAddVisible.value = true
  isLoadingSurah.value = true
  try {
    const res = await api.get(`/mahasiswa/setoran/${mhs.nim}`)
    listSurah.value = res.data.data.setoran.detail
      .filter(item => item.sudah_setor === false)
      .map(item => ({
        id_komponen_setoran: item.id,
        nama_komponen_setoran: item.nama,
        nama_arab: arabicNames[item.id] || ''
      }))
  } catch (err) {
    dialogAddVisible.value = false
    ElMessage.error('Gagal memuat daftar surah mahasiswa.')
  } finally { isLoadingSurah.value = false }
}

const submitSave = async () => {
  if (selectedSurahs.value.length === 0) return ElMessage.warning('Pilih minimal 1 surah!')
  isSubmitting.value = true
  try {
    const payload = {
      data_setoran: selectedSurahs.value.map(s => ({
        id_komponen_setoran: s.id_komponen_setoran,
        nama_komponen_setoran: s.nama_komponen_setoran
      })),
      tgl_setoran: tglSetoran.value
    }
    await api.post(`/mahasiswa/setoran/${selectedNim.value}`, payload)
    ElMessage.success("Berhasil menambahkan setoran baru!")
    dialogAddVisible.value = false
    loadDashboardData() 
  } catch (err) {
    ElMessage.error(err.response?.data?.message || 'Gagal menyimpan setoran')
  } finally { isSubmitting.value = false }
}

const openDeleteModal = async (mhs) => {
  selectedNim.value = mhs.nim
  selectedNama.value = mhs.nama
  selectedForDelete.value = []
  dialogDeleteVisible.value = true
  isLoadingSurah.value = true
  try {
    const res = await api.get(`/mahasiswa/setoran/${mhs.nim}`)
    deletableSurahs.value = res.data.data.setoran.detail
      .filter(item => item.sudah_setor === true && item.info_setoran)
      .map(item => ({
        id: item.info_setoran.id,
        id_komponen_setoran: item.id,
        nama_komponen_setoran: item.nama,
        nama_arab: arabicNames[item.id] || ''
      }))
    if (deletableSurahs.value.length === 0) {
      dialogDeleteVisible.value = false
      ElMessage.warning('Mahasiswa ini belum memiliki setoran yang bisa dibatalkan.')
    }
  } catch (err) {
    dialogDeleteVisible.value = false
    ElMessage.error('Gagal memuat riwayat setoran mahasiswa.')
  } finally { isLoadingSurah.value = false }
}

const submitDelete = async () => {
  if (selectedForDelete.value.length === 0) return ElMessage.warning('Pilih minimal 1 surah!')
  isDeleting.value = true
  try {
    const payload = {
      data_setoran: selectedForDelete.value.map(s => ({
        id: s.id,
        id_komponen_setoran: s.id_komponen_setoran,
        nama_komponen_setoran: s.nama_komponen_setoran
      }))
    }
    await api.delete(`/mahasiswa/setoran/${selectedNim.value}`, { data: payload })
    ElMessage.success("Berhasil membatalkan setoran!")
    dialogDeleteVisible.value = false
    loadDashboardData()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || 'Gagal membatalkan setoran')
  } finally { isDeleting.value = false }
}

const handleLogout = () => {
  localStorage.removeItem('auth-token')
  router.push('/')
}

onMounted(loadDashboardData)
</script>

<style scoped>
/* PERUBAHAN: Background Luar disamakan dengan Login (#0f172a) */
.dashboard-container { 
  min-height: 100vh; 
  padding: 40px; 
  background: #0f172a; 
  display: flex; 
  justify-content: center; 
  align-items: flex-start; 
  font-family: 'Inter', sans-serif; 
}

/* PERUBAHAN: Kotak tetap Putih Bersih (0.98 agar kontras) */
.glass-card { 
  background: rgba(255, 255, 255, 0.98); 
  backdrop-filter: blur(16px); 
  border-radius: 20px; 
  padding: 30px; 
  width: 100%; 
  max-width: 1000px; 
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4); 
  border: 1px solid rgba(255, 255, 255, 0.5); 
}

.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
.title-text { margin: 0; font-size: 24px; color: #1e293b; font-weight: 700; letter-spacing: -0.5px; }
.dosen-text { margin: 5px 0 0; color: #64748b; font-size: 14px; }
.custom-table { border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
.custom-table ::v-deep(th.el-table__cell) { background-color: #f8fafc !important; color: #334155 !important; }

.modal-body { color: #1e293b !important; }
.user-header { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; padding: 15px; background: #f8fafc; border-radius: 10px; }
.avatar { width: 45px; height: 45px; background: #38bdf8; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; }
.user-detail h3 { margin: 0; color: #0f172a; }
.user-detail p { margin: 0; color: #64748b; font-size: 13px; }
.content-grid { display: grid; grid-template-columns: 220px 1fr; gap: 30px; }
.sub-title { font-size: 14px; color: #0284c7; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
.progress-container { text-align: center; background: #f0f9ff; padding: 15px; border-radius: 10px; }
.stats-list { margin-top: 15px; text-align: left; background: white; padding: 10px; border-radius: 8px; }
.stat-item { font-size: 13px; display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot.green { background: #10b981; }
.dot.gray { background: #cbd5e1; }
.table-container { background: white; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; }

.dialog-custom-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 15px; }
.dialog-custom-header h3 { margin: 0; color: #0f172a; font-size: 18px; display: flex; align-items: center; gap: 8px;}
.student-info-card { display: flex; align-items: center; gap: 15px; background: #f0f9ff; padding: 12px 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #bae6fd; }
.avatar-small { width: 35px; height: 35px; background: #0ea5e9; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 18px; }
.student-text { display: flex; flex-direction: column; }
.lbl-menyetorkan { font-size: 12px; color: #64748b; }
.student-text strong { color: #0f172a; font-size: 14px; }
.form-setoran .el-form-item__label { font-weight: 600; color: #334155; padding-bottom: 5px; }
</style>