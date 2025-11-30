# Fasilitas dan Inventaris RT

## 1. Deskripsi Fitur

Fitur ini mencatat dan mengelola:
- Fasilitas umum (pos ronda, taman, lapangan)
- Inventaris RT (tenda, kursi, sound system, HT, dsb)
- Peminjaman inventaris oleh warga/panitia

---

## 2. Data Fasilitas & Inventaris

Field utama:
- `id_inventaris`
- `nama_barang`
- `kategori` (fasilitas / inventaris)
- `jumlah_total`
- `jumlah_tersedia`
- `lokasi_penyimpanan`
- `kondisi` (baik / perlu perbaikan / rusak)
- `catatan`

---

## 3. Peminjaman Inventaris

Warga atau panitia bisa mengajukan peminjaman:

Field:
- `id_peminjaman`
- `pemohon` (id_warga / kelompok)
- `id_inventaris`
- `tanggal_mulai`
- `tanggal_selesai`
- `keperluan`
- `status` (diajukan / disetujui / ditolak / selesai)
- `catatan_admin`

---

## 4. Hak Akses

- **Admin RT**
  - Mengelola data inventaris dan menyetujui peminjaman.
- **Warga**
  - Melihat daftar inventaris dan mengajukan peminjaman.
