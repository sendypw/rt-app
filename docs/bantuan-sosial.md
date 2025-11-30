# Bantuan Sosial

## 1. Deskripsi Fitur

Fitur ini digunakan untuk:
- Mendata warga rentan (lansia, disabilitas, keluarga kurang mampu, yatim/piatu)
- Mencatat penyaluran bantuan sosial
- Menyiapkan data untuk pengajuan bantuan ke tingkat di atas (RW, kelurahan, dll)

---

## 2. Data Penerima Bantuan

Field:
- `id_penerima_bantuan`
- `id_kk` / `id_warga`
- `kategori` (lansia / disabilitas / yatim/piatu / keluarga kurang mampu / lain-lain)
- `keterangan`
- `status` (diusulkan / disetujui / tidak memenuhi syarat)

---

## 3. Data Penyaluran Bantuan

Field:
- `id_penyaluran`
- `id_penerima_bantuan`
- `tanggal`
- `jenis_bantuan` (sembako, uang, barang, layanan)
- `sumber_bantuan` (RT / RW / kelurahan / CSR / lain-lain)
- `nominal` / `estimasi_nilai`
- `catatan`

---

## 4. Hak Akses

- **Admin RT**
  - Mengelola data penerima dan penyaluran bantuan.
- **Pengurus PKK / Karang Taruna**
  - Dapat diberi akses untuk input data lapangan (opsional).
- **Warga**
  - Tidak mengakses data pribadi orang lain (hanya info program umum).
