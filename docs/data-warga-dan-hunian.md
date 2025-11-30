# Data Warga dan Hunian

## 1. Deskripsi Fitur

Fitur **Data Warga dan Hunian** adalah fondasi aplikasi RT Online.  
Semua modul lain (surat pengantar, iuran, jadwal jaga, PKK, Karang Taruna, dll) bergantung pada data ini.

Entitas utama:
- Hunian (rumah/kontrakan/kos)
- Kepala Keluarga (KK)
- Anggota keluarga
- Kendaraan

---

## 2. Entitas & Field Utama

### 2.1. Hunian

- `id_hunian`
- `blok` / `cluster` (opsional)
- `nomor_rumah`
- `jenis_hunian` (milik, kontrakan, kos)
- `status_aktif` (aktif / nonaktif)
- `catatan` (opsional)

### 2.2. Kepala Keluarga

- `id_kk`
- `id_hunian`
- `nama_kepala_keluarga`
- `nomor_kk`
- `nik`
- `tanggal_lahir`
- `jenis_kelamin`
- `pekerjaan`
- `no_hp`
- `email` (opsional)
- `status` (aktif / pindah / meninggal)

### 2.3. Anggota Keluarga

- `id_anggota`
- `id_kk`
- `nama`
- `nik`
- `hubungan_dengan_kepala_keluarga` (istri, anak, orang tua, dll)
- `tanggal_lahir`
- `jenis_kelamin`
- `pekerjaan` (opsional)
- `status` (aktif / pindah / meninggal / tinggal sementara)

### 2.4. Kendaraan (Opsional)

- `id_kendaraan`
- `id_hunian`
- `jenis` (mobil, motor, sepeda)
- `plat_nomor`
- `warna`
- `catatan` (opsional)

---

## 3. Alur Utama

### 3.1. Tambah Hunian Baru

1. Admin RT menambah hunian baru.
2. Mengisi blok/cluster, nomor rumah, jenis hunian.
3. Menandai status aktif.

### 3.2. Tambah KK & Anggota

1. Pilih hunian.
2. Tambah data kepala keluarga.
3. Tambah anggota keluarga satu per satu.
4. Otomatis tercatat sebagai warga RT tersebut.

### 3.3. Pindah Datang

1. Admin RT menambah KK baru dengan status **pindah datang**.
2. (Opsional) Mengaitkan dengan **Surat Pengantar Pindah Datang** di modul surat.

### 3.4. Pindah Keluar

1. Admin RT mengubah status KK/anggota menjadi **pindah**.
2. Menyimpan tanggal pindah dan tujuan (RT/RW/kota lain).
3. (Opsional) Mengaitkan dengan **Surat Pengantar Pindah Keluar**.

### 3.5. Kematian

1. Admin RT mengubah status anggota menjadi **meninggal**.
2. Mengisi tanggal meninggal dan lokasi.
3. (Opsional) Mengaitkan dengan **Surat Pengantar Kematian** di modul surat.

---

## 4. Hak Akses

- **Admin RT**
  - Full akses CRUD data hunian, KK, anggota, dan kendaraan.
- **Pengurus PKK, Karang Taruna, Jaga RT**
  - Akses baca (read-only) data tertentu sesuai kebutuhan modul masing-masing.
- **Warga**
  - Hanya dapat melihat dan mengajukan perubahan pada data KK/anggota yang terkait dengan dirinya sendiri (melalui permintaan perubahan data yang disetujui oleh Admin RT).

---

## 5. Integrasi dengan Modul Lain

- **Surat Pengantar**
  - Data pemohon surat terambil langsung dari data KK/anggota.
- **Keuangan & Iuran**
  - Iuran dikaitkan dengan `id_hunian` dan `id_kk`.
- **Jaga RT**
  - Jadwal jaga bisa dibentuk berdasarkan hunian atau KK.
- **PKK & Dasawisma**
  - Kelompok dasawisma dapat diisi berdasarkan rumah/KK yang sudah ada.
- **Bantuan Sosial**
  - Kategori rentan diambil dari data warga (lanjut usia, disabilitas, dll).
