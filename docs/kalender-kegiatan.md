# Kalender Kegiatan RT

## 1. Deskripsi Fitur

Fitur ini menggabungkan semua kegiatan lingkungan ke dalam satu kalender:

- Rapat RT
- Jaga RT (opsional untuk tampil di kalender)
- Kerja bakti
- Kegiatan PKK
- Kegiatan Karang Taruna
- Kegiatan keagamaan
- Event musiman (17 Agustus, hari besar, dll)

---

## 2. Struktur Data Kegiatan

Field:
- `id_kegiatan`
- `judul`
- `kategori` (RT, PKK, Karang Taruna, Keagamaan, Kebersihan, Keamanan, dll)
- `tanggal_mulai`
- `tanggal_selesai` (opsional)
- `waktu_mulai` (opsional)
- `waktu_selesai` (opsional)
- `lokasi`
- `penyelenggara`
- `deskripsi`
- `tautan_pendukung` (opsional)

---

## 3. Hak Akses

- **Admin RT, Pengurus PKK, Karang Taruna, Jaga RT**
  - Dapat membuat dan mengedit kegiatan sesuai kewenangannya.
- **Warga**
  - Dapat melihat daftar kegiatan di kalender.
