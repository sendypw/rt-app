# Fitur: Masuk ke Aplikasi (Login)

Fitur ini adalah gerbang utama untuk mengakses aplikasi. Setiap pengguna, baik warga maupun admin, harus melakukan otentikasi sebelum dapat menggunakan fungsionalitas lainnya.

## Cara Penggunaan

1.  **Buka Halaman Login:** Saat pertama kali membuka aplikasi, Anda akan langsung diarahkan ke halaman login.
2.  **Masukkan Kredensial:**
    *   **Nomor Rumah:** Isi kolom ini dengan nomor rumah Anda yang terdaftar (contoh: `A1`, `B5`, `C10`).
    *   **Kata Sandi:** Masukkan kata sandi yang telah diberikan oleh pengurus RT. Untuk tujuan pengembangan dan demonstrasi, kata sandi default adalah `password123`.
3.  **Klik Tombol "Masuk":** Setelah mengisi kedua kolom, klik tombol "Masuk" untuk melanjutkan.

## Apa yang Terjadi Selanjutnya?

*   **Login Berhasil:** Jika nomor rumah dan kata sandi benar, Anda akan diarahkan ke **Dasbor** utama aplikasi.
*   **Login Gagal:** Jika nomor rumah atau kata sandi salah, sebuah pesan error akan muncul di bawah kolom input, dan Anda akan tetap berada di halaman login untuk mencoba lagi.
