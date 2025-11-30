# PKK dan Dasawisma

## 1. Deskripsi Fitur

Fitur ini mendukung kegiatan PKK di tingkat RT, khususnya:
- Pendataan kelompok dasawisma
- Pendataan keluarga, balita, dan kegiatan posyandu
- Jadwal dan laporan kegiatan PKK

---

## 2. Kelompok Dasawisma

Field:
- `id_dasawisma`
- `nama_kelompok`
- `ketua_kelompok` (id_warga)
- `anggota` (daftar id_kk atau id_warga)
- `catatan`

---

## 3. Data Keluarga & Balita (Opsional)

Jika ingin, PKK dapat menyimpan data tambahan:
- Status balita
- Status ibu hamil
- Catatan gizi

Field contoh balita:
- `id_balita`
- `id_kk` / `id_anggota`
- `tanggal_lahir`
- `jenis_kelamin`
- `riwayat_tinggi`
- `riwayat_berat`
- `status_gizi`

---

## 4. Kegiatan PKK

Contoh:
- Arisan
- Penyuluhan kesehatan
- Pelatihan keterampilan
- Kegiatan 10 program pokok PKK

Field:
- `id_kegiatan_pkk`
- `judul`
- `tanggal`
- `lokasi`
- `penyelenggara` (pengurus/kelompok)
- `deskripsi`
- `peserta` (daftar id_warga / id_kk)

---

## 5. Laporan PKK

- Rekap jumlah kelompok dasawisma
- Jumlah keluarga anggota
- Kehadiran dalam kegiatan
- (Opsional) Data ringkas balita & gizi untuk pelaporan ke level di atas RT

---

## 6. Hak Akses

- **Pengurus PKK**
  - Mengelola data dasawisma dan kegiatan.
- **Admin RT**
  - Akses baca & laporan ringkas.
- **Warga**
  - Melihat jadwal kegiatan dan info umum PKK.
