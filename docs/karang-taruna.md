# Karang Taruna

## 1. Deskripsi Fitur

Fitur **Karang Taruna** mendukung:
- Pendataan anggota pemuda
- Pengelolaan kegiatan pemuda (olahraga, seni, sosial)
- Pengelolaan kas Karang Taruna
- Dokumentasi dan informasi event

---

## 2. Anggota Karang Taruna

Field:
- `id_anggota_kartar`
- `id_warga`
- `bidang` (olahraga, seni, sosial, kewirausahaan, dll)
- `jabatan` (ketua, sekertaris, anggota, dll)
- `status` (aktif / nonaktif)

---

## 3. Kegiatan Karang Taruna

Contoh:
- Turnamen olahraga
- Lomba 17 Agustus
- Pentas seni
- Bakti sosial

Field:
- `id_kegiatan_kartar`
- `judul`
- `tanggal`
- `lokasi`
- `penanggung_jawab`
- `deskripsi`
- `jenis` (olahraga/seni/sosial/dll)
- `peserta` (opsional)

---

## 4. Kas Karang Taruna

- Pemasukan:
  - Iuran anggota
  - Hasil event
  - Donasi
- Pengeluaran:
  - Peralatan
  - Hadiah lomba
  - Transport, konsumsi, dll

Field:
- `id_transaksi_kartar`
- `tanggal`
- `jenis` (pemasukan / pengeluaran)
- `nominal`
- `sumber` / `tujuan`
- `keterangan`

---

## 5. Hak Akses

- **Pengurus Karang Taruna**
  - Mengelola anggota, kegiatan, dan kas.
- **Admin RT**
  - Mengakses laporan keuangan & kegiatan Karang Taruna.
- **Warga**
  - Melihat pengumuman & jadwal kegiatan Karang Taruna.
