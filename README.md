# RT Online – Dokumentasi Fitur

RT Online adalah aplikasi manajemen lingkungan tingkat Rukun Tetangga (RT) yang membantu pengurus dan warga dalam mengelola:
- Data warga & hunian
- Surat pengantar RT
- Iuran & kas RT
- Jaga RT (ronda / siskamling)
- Kegiatan PKK
- Kegiatan Karang Taruna
- Kebersihan & bank sampah
- Fasilitas & inventaris RT
- Bantuan sosial
- Marketplace usaha warga
- Kalender kegiatan & komunikasi internal

Seluruh dokumentasi fitur detail berada di direktori `docs/`.

---

## 1. Tujuan Aplikasi

1. Mempermudah administrasi RT (khususnya surat pengantar dan pendataan warga).
2. Meningkatkan transparansi iuran dan kas RT.
3. Mengorganisir jadwal jaga (ronda), PKK, dan Karang Taruna secara digital.
4. Menjadi pusat informasi dan koordinasi warga dalam satu platform terpadu.
5. Menyediakan pondasi untuk dikembangkan menjadi platform RT/RW berskala lebih besar (SaaS).

---

## 2. Peran Pengguna (User Roles)

Aplikasi mengelola beberapa peran utama:

- **Admin RT**
  - Mengelola data warga & hunian
  - Menerbitkan surat pengantar RT
  - Mengelola iuran & kas
  - Mengelola jadwal jaga, kegiatan PKK, Karang Taruna, kalender kegiatan, dan pengumuman
- **Pengurus Jaga RT / Keamanan**
  - Mengelola jadwal ronda
  - Mencatat kehadiran jaga
  - Mengelola log tamu dan laporan insiden
- **Pengurus PKK**
  - Mengelola data dasawisma
  - Mencatat kegiatan PKK dan data posyandu (opsional)
- **Pengurus Karang Taruna**
  - Mengelola anggota, kegiatan, dan kas Karang Taruna
- **Warga**
  - Mengajukan surat pengantar
  - Melihat status tagihan iuran dan riwayat pembayaran
  - Mengakses pengumuman, jadwal kegiatan, dan marketplace usaha warga

Role dapat dikombinasikan, misalnya satu orang bisa sekaligus menjadi Admin RT dan Pengurus Karang Taruna.

---

## 3. Konvensi Umum

### 3.1. Format Nomor Surat Pengantar

RT hanya menerbitkan **Surat Pengantar**, bukan Surat Keterangan.  
Format penomoran surat yang digunakan:

> `nomor_urut/06.07/angka_bulan/angka_tahun`

Keterangan:
- `nomor_urut` : nomor urut surat per tahun (mis. `001`, `002`, …)
- `06.07`      : kode tetap (bisa dikonfigurasi, misal RT 06 RW 07)
- `angka_bulan`: `01`–`12`
- `angka_tahun`: `YYYY` (mis. `2025`)

Contoh:
- `001/06.07/03/2025`
- `015/06.07/10/2025`

Logika auto-generate dijelaskan di `docs/surat-pengantar-rt.md`.

---

## 4. Daftar Fitur & Dokumen

Setiap fitur utama didokumentasikan di file terpisah:

- `docs/data-warga-dan-hunian.md`
- `docs/surat-pengantar-rt.md`
- `docs/keuangan-dan-iuran.md`
- `docs/jaga-rt.md`
- `docs/pkk-dasawisma.md`
- `docs/karang-taruna.md`
- `docs/bank-sampah-dan-kebersihan.md`
- `docs/fasilitas-dan-inventaris-rt.md`
- `docs/bantuan-sosial.md`
- `docs/marketplace-usaha-warga.md`
- `docs/kalender-kegiatan.md`
- `docs/komunikasi-dan-pengumuman.md`

Selain itu:
- `AGENTS.md` – panduan untuk AI Agent yang membantu pengguna di dalam aplikasi.

---

## 5. Struktur Direktori (Usulan)

```text
.
├─ README.md
├─ AGENTS.md
└─ docs/
   ├─ data-warga-dan-hunian.md
   ├─ surat-pengantar-rt.md
   ├─ keuangan-dan-iuran.md
   ├─ jaga-rt.md
   ├─ pkk-dasawisma.md
   ├─ karang-taruna.md
   ├─ bank-sampah-dan-kebersihan.md
   ├─ fasilitas-dan-inventaris-rt.md
   ├─ bantuan-sosial.md
   ├─ marketplace-usaha-warga.md
   ├─ kalender-kegiatan.md
   └─ komunikasi-dan-pengumuman.md
```

---

## 6. Roadmap Singkat

Tahap implementasi disarankan bertahap:

1. **Fase 1 – Inti Administrasi**
   - Data warga & hunian
   - Surat pengantar RT
   - Keuangan & iuran
   - Komunikasi & pengumuman

2. **Fase 2 – Keamanan & Komunitas**
   - Jaga RT
   - PKK
   - Karang Taruna
   - Kalender kegiatan

3. **Fase 3 – Pengembangan Lingkungan**
   - Bank sampah & kebersihan
   - Fasilitas & inventaris
   - Bantuan sosial
   - Marketplace usaha warga
   - Integrasi AI Agent (lihat `AGENTS.md`)
