# Komunikasi dan Pengumuman

## 1. Deskripsi Fitur

Fitur ini digunakan untuk komunikasi satu arah dari pengurus ke warga, antara lain:

- Pengumuman resmi RT
- Pemberitahuan perubahan iuran
- Pemberitahuan jadwal rapat/kerja bakti
- Informasi bantuan sosial
- Informasi kegiatan PKK, Karang Taruna

---

## 2. Pengumuman

Field:
- `id_pengumuman`
- `judul`
- `isi`
- `kategori` (RT, PKK, Karang Taruna, Kebersihan, Keamanan, dll)
- `tanggal_publikasi`
- `dibuat_oleh` (id_user/pengurus)
- `lampiran` (opsional)

---

## 3. Notifikasi

Saat pengumuman baru dibuat, sistem dapat mengirim notifikasi:
- In-app notification
- Email (opsional)
- WhatsApp/SMS (jika diintegrasikan)

---

## 4. Hak Akses

- **Admin RT dan pengurus terkait**
  - Dapat membuat dan mengelola pengumuman.
- **Warga**
  - Dapat melihat semua pengumuman yang relevan dengan RT tempatnya terdaftar.
