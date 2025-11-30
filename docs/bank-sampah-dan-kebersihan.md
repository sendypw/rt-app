# Bank Sampah dan Kebersihan Lingkungan

## 1. Deskripsi Fitur

Fitur ini mengelola:
- Jadwal kerja bakti
- Titik masalah kebersihan (sampah, saluran, dsb)
- (Opsional) Bank sampah dengan pencatatan setoran warga

---

## 2. Jadwal Kerja Bakti

Field:
- `id_kerja_bakti`
- `tanggal`
- `lokasi`
- `fokus` (saluran, taman, jalan, dll)
- `penanggung_jawab`
- `catatan`

Warga dapat:
- Melihat jadwal
- Menandai kehadiran (opsional)

---

## 3. Laporan Kebersihan

Warga dapat melaporkan:
- Sampah menumpuk
- Saluran tersumbat
- Pohon rawan tumbang
- Lain-lain

Field:
- `id_laporan_kebersihan`
- `pelapor` (id_warga)
- `kategori`
- `deskripsi`
- `foto` (opsional)
- `lokasi` (opsional)
- `status` (baru / diproses / selesai)

---

## 4. Bank Sampah (Opsional)

Field:
- `id_setoran_sampah`
- `id_kk` / `id_warga`
- `tanggal`
- `jenis_sampah` (plastik, kertas, logam, dll)
- `berat`
- `poin` / `nilai`
- `catatan`

Saldo bank sampah dapat ditukar dengan:
- Uang
- Barang
- Pengurangan iuran (jika kebijakan RT mendukung)

---

## 5. Hak Akses

- **Admin RT / Koordinator Kebersihan**
  - Mengelola jadwal, laporan, dan setoran bank sampah.
- **Warga**
  - Melihat jadwal kerja bakti dan melaporkan masalah kebersihan.
