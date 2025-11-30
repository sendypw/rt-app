# Jaga RT (Ronda / Siskamling)

## 1. Deskripsi Fitur

Fitur **Jaga RT** digunakan untuk mengelola:
- Jadwal ronda (shift jaga malam)
- Kehadiran petugas jaga
- Buku tamu digital
- Laporan insiden keamanan

---

## 2. Jadwal Ronda

- Penjadwalan per:
  - Hunian/KK
  - Nama warga
- Pola jadwal:
  - Harian, bergilir, atau pola khusus per minggu.

Field contoh:
- `id_jadwal_jaga`
- `tanggal`
- `shift` (opsional)
- `id_kk` atau `id_warga` yang bertugas
- `status` (terjadwal / dibatalkan)

---

## 3. Absensi Jaga

Metode absensi:
- Tombol “Hadir” di aplikasi (dicatat waktu dan lokasi).
- Scan QR di pos jaga (opsional).

Field:
- `id_absensi_jaga`
- `id_jadwal_jaga`
- `id_warga`
- `waktu_absen`
- `lokasi` (opsional)
- `keterangan`

---

## 4. Buku Tamu Digital

Digunakan oleh petugas jaga untuk mencatat tamu yang masuk.

Field:
- `id_buku_tamu`
- `nama_tamu`
- `tujuan_ke_rumah` (id_hunian / nama KK)
- `waktu_datang`
- `waktu_pulang` (opsional)
- `catatan`

---

## 5. Laporan Insiden

Warga atau petugas jaga dapat mengirim laporan seperti:
- Keributan
- Tamu mencurigakan
- Pencurian
- Fasilitas rusak (lampu jalan, pagar, dll)

Field:
- `id_insiden`
- `pelapor` (id_warga)
- `kategori` (keamanan, fasilitas, lain-lain)
- `deskripsi`
- `foto` (opsional)
- `lokasi` (opsional)
- `status` (baru / diproses / selesai)
- `tindak_lanjut` (diisi admin/petugas)

---

## 6. Hak Akses

- **Pengurus Jaga RT / Admin RT**
  - Mengelola jadwal, absensi, buku tamu, dan laporan insiden.
- **Warga**
  - Melihat jadwal ronda (siapa jaga kapan).
  - Mengirim laporan insiden.
