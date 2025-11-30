# Keuangan dan Iuran RT

## 1. Deskripsi Fitur

Fitur ini digunakan untuk:

- Mengelola jenis iuran (kebersihan, keamanan, kas RT, iuran insidental).
- Menerbitkan tagihan per hunian/KK.
- Mencatat pembayaran (tunai atau non-tunai).
- Mengelola kas RT dan laporan keuangan.

---

## 2. Jenis Iuran

- **Iuran Rutin**
  - Bulanan (misal: kebersihan, keamanan).
  - Tahunan (misal: iuran 17 Agustus, peringatan hari besar).
- **Iuran Insidental**
  - Iuran pembangunan, renovasi fasilitas, bakti sosial tertentu, dll.

Field utama:
- `id_jenis_iuran`
- `nama_iuran`
- `frekuensi` (bulanan / tahunan / insidental)
- `besar_iuran`
- `mulai_berlaku`
- `status_aktif`

---

## 3. Tagihan

Tagihan dikaitkan dengan `id_hunian` atau `id_kk`.

Field:
- `id_tagihan`
- `id_jenis_iuran`
- `id_hunian` / `id_kk`
- `periode` (misal `2025-03`, atau tanggal jatuh tempo)
- `nominal`
- `status` (belum dibayar / dibayar sebagian / lunas)
- `tanggal_jatuh_tempo`

---

## 4. Pembayaran

Pembayaran dapat:
- Dicatat manual (tunai)
- Diintegrasikan dengan payment gateway (QRIS/VA/e-wallet) – opsional

Field:
- `id_pembayaran`
- `id_tagihan`
- `tanggal_bayar`
- `metode_bayar` (tunai, transfer, qris, dll)
- `nominal_dibayar`
- `keterangan`

---

## 5. Kas RT

Kas RT mencatat seluruh:
- Pemasukan:
  - Iuran warga
  - Donasi
  - Sumbangan kegiatan
- Pengeluaran:
  - Operasional keamanan & kebersihan
  - Kegiatan RT
  - Bantuan sosial
  - Pembelian inventaris

Laporan kas:
- Rekap per bulan/tahun
- Saldo awal & saldo akhir

---

## 6. Hak Akses

- **Admin RT**
  - Mengelola jenis iuran, tagihan, dan kas.
- **Warga**
  - Melihat daftar tagihan dan riwayat pembayaran milik hunian/KK sendiri.
  - Mendapat notifikasi ketika ada tagihan baru dan jatuh tempo.
