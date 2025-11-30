# Surat Pengantar RT

## 1. Prinsip Utama

- **RT hanya menerbitkan _Surat Pengantar_**, bukan Surat Keterangan.
- **Surat Keterangan** (domisili, tidak mampu, usaha, kelahiran, kematian, dll) diterbitkan oleh **kelurahan**.
- Banyak layanan di kelurahan **mensyaratkan Surat Pengantar RT** sebagai verifikasi bahwa pemohon adalah warga setempat.

Di aplikasi, seluruh surat yang keluar dari RT dimodelkan sebagai:  
> "Surat Pengantar RT untuk pengurusan [nama layanan] di Kelurahan."

---

## 2. Format Nomor Surat

Format nomor surat:

> `nomor_urut/06.07/angka_bulan/angka_tahun`

Contoh:
- `001/06.07/03/2025`
- `015/06.07/10/2025`

### 2.1. Aturan Penomoran

- `nomor_urut`
  - Di-reset setiap awal tahun (1 Januari).
  - Menggunakan 3 digit (001–999).
- `06.07`
  - Kode RT, dapat disimpan di konfigurasi:
    - Misal: RT 06 / RW 07 → `06.07`
- `angka_bulan`
  - Diisi nilai `01`–`12` dari tanggal surat.
- `angka_tahun`
  - Menggunakan format `YYYY`.

### 2.2. Pseudocode Auto-Generate

```text
function generateNomorSurat(tanggalSurat):
    tahun = YEAR(tanggalSurat)
    bulan = MONTH(tanggalSurat)  // 1-12
    nomorUrutTerakhir = getLastNumberForYear(tahun)  // misal 14
    nomorUrutBaru = nomorUrutTerakhir + 1            // 15

    nomorUrutStr = padLeft(nomorUrutBaru, 3, '0')    // "015"
    bulanStr = padLeft(bulan, 2, '0')               // "10"
    kodeRT = getConfig("KODE_RT")                   // "06.07"

    return nomorUrutStr + "/" + kodeRT + "/" + bulanStr + "/" + tahun
```

---

## 3. Daftar Jenis Surat Pengantar

### 3.1. Kependudukan Dasar

- Pengantar Pembuatan / Perubahan KTP-el  
- Pengantar Pembuatan / Perubahan Kartu Keluarga (KK)  
- Pengantar Pembuatan Surat Keterangan Domisili / SKTTS  
- Pengantar Perbaikan Data Kependudukan  
  (perbedaan nama, tanggal lahir, dll)

### 3.2. Status Pernikahan & Keluarga

- Pengantar Surat Keterangan Belum Menikah  
- Pengantar Surat Keterangan Menikah / sudah menikah  
- Pengantar Nikah (N1–N4 / sejenis, sesuai format kelurahan)

### 3.3. Perpindahan Penduduk

- Pengantar Pindah Datang (penduduk masuk RT)  
- Pengantar Pindah Keluar (penduduk keluar RT/daerah lain)

### 3.4. Kelahiran & Kematian

- Pengantar Kelahiran  
  - Untuk pengurusan Surat Keterangan Kelahiran dan Akta Kelahiran  
- Pengantar Kematian  
  - Untuk pengurusan Surat Keterangan Kematian dan Akta Kematian

### 3.5. Sosial & Ekonomi

- Pengantar Surat Keterangan Usaha (SKU)  
- Pengantar Surat Keterangan Tidak Mampu (SKTM)  
- Pengantar Surat Keterangan Penghasilan  
- Pengantar Program Bantuan Sosial (PKH, KIS, bantuan pendidikan, dsb)

### 3.6. Keamanan & Lain-lain

- Pengantar SKCK  
- Pengantar Surat Keterangan Kehilangan  
- Pengantar Izin Hajatan / Izin Keramaian  
- Pengantar layanan pertanahan/waris/domisili politik (sesuai praktik setempat)  
- Pengantar Lain-lain (template generik)

---

## 4. Alur Pengajuan Surat Pengantar

### 4.1. Dari Sisi Warga (Front Office)

1. Warga login sebagai **Warga**.
2. Masuk ke menu **Surat Pengantar** → klik **Ajukan Surat Baru**.
3. Pilih **Jenis Surat Pengantar** (misal: Pengantar SKCK).
4. Form otomatis menampilkan data dasar dari profil dan data warga:
   - Nama, NIK, alamat, status keluarga.
5. Warga mengisi data tambahan yang diminta:
   - Tujuan surat, instansi tujuan, keperluan singkat.
6. Warga mengunggah lampiran jika diperlukan (KK, KTP, dll).
7. Submit pengajuan → status awal `DIAJUKAN`.

### 4.2. Dari Sisi Admin RT

1. Admin RT buka menu **Verifikasi Surat**.
2. Melihat daftar pengajuan dengan status `DIAJUKAN`.
3. Melakukan pengecekan data & lampiran.
4. Jika ada yang kurang:
   - Bisa mengubah status menjadi `PERLU_PERBAIKAN` dan menambahkan catatan.
5. Jika disetujui:
   - Sistem menggenerate **Nomor Surat** secara otomatis.
   - Admin dapat mengedit isi template jika perlu (bagian bebas).
6. Admin mengonfirmasi penerbitan:
   - Status surat menjadi `DISETUJUI`.
   - File PDF surat dihasilkan (untuk dicetak atau dikirim ke warga).

---

## 5. Template & Output Surat

### 5.1. Template Surat

Setiap jenis surat pengantar memiliki template:

- Header RT (nama RT/RW, alamat, kontak)
- Nomor Surat (otomatis)
- Perihal (jenis pengantar)
- Identitas pemohon (nama, NIK, alamat, status keluarga)
- Uraian/intisari keperluan
- Penutup dan tanda tangan Ketua RT

Template disimpan dalam database atau file terpisah dan bisa diedit oleh Admin RT (misalnya di menu **Pengaturan Surat**).

### 5.2. Format Output

- **PDF siap cetak**
  - Untuk kebutuhan fisik.
- **Preview HTML**
  - Untuk ditampilkan di dashboard.
- (Opsional) **QR Code**
  - Berisi URL verifikasi surat di aplikasi.

---

## 6. Hak Akses

- **Warga**
  - Mengajukan surat pengantar.
  - Melihat status dan mengunduh surat yang sudah disetujui.
- **Admin RT**
  - Melihat semua pengajuan.
  - Menyetujui/menolak/meminta perbaikan.
  - Mengedit template & mengubah nomor surat (dalam batas tertentu).
