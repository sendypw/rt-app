# Fitur: Halaman Jadwal

Halaman ini berfungsi sebagai pusat informasi untuk semua jadwal siskamling yang telah ditetapkan oleh admin. Pengguna dapat melihat daftar lengkap tugas untuk semua warga.

## Tampilan & Fungsionalitas

1.  **Tabel Jadwal:**
    *   **Isi:** Menampilkan data dalam format tabel yang rapi, mencakup kolom:
        *   **Tanggal:** Tanggal pelaksanaan tugas.
        *   **Hari:** Nama hari untuk tanggal tersebut.
        *   **Warga:** Nama warga yang bertugas.
        *   **No. Rumah:** Nomor rumah warga yang bertugas.
        *   **Status:** Menunjukkan apakah warga tersebut sudah `Hadir` (check-in) atau masih `Menunggu`.
    *   **Highlight:** Baris jadwal milik pengguna yang sedang login akan diberi warna latar yang berbeda untuk memudahkan identifikasi.

2.  **Aksi Tukar Jadwal:**
    *   Di sebelah kanan setiap baris jadwal (yang bukan milik Anda dan belum lewat tanggalnya), terdapat tombol **"Minta Tukar"**.
    *   Fitur ini memungkinkan Anda untuk mengajukan permintaan pertukaran jadwal dengan warga lain. (Lihat dokumentasi `05-tukar-jadwal.md` untuk detail lebih lanjut).
