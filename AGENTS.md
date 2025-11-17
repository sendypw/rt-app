# Panduan Kolaborasi & Praktik Terbaik

Dokumen ini berisi serangkaian aturan dan panduan untuk memastikan proses pengembangan berjalan lancar, konsisten, dan menghasilkan aplikasi berkualitas tinggi.

## 1. Pesan Commit

Setiap `commit` **harus** mengikuti standar **Conventional Commits**. Ini membantu menjaga riwayat perubahan yang bersih dan mudah dibaca. Format dasarnya adalah:

```
<tipe>(<lingkup>): <deskripsi singkat>
```

- **Tipe Commit:**
  - `feat`: Menambahkan fitur baru.
  - `fix`: Memperbaiki bug.
  - `docs`: Perubahan pada dokumentasi.
  - `style`: Perubahan format atau gaya kode (spasi, titik koma, dll.).
  - `refactor`: Perubahan kode yang tidak memperbaiki bug atau menambahkan fitur.
  - `perf`: Perubahan kode yang meningkatkan performa.
  - `test`: Menambahkan atau memperbaiki tes.
  - `chore`: Perubahan pada proses build atau alat bantu lainnya.

**Contoh:**
- `feat(auth): add login form component`
- `fix(schedule): correct date formatting in table`
- `style(components): format code with prettier`

## 2. Bahasa dan Lokalisasi

Semua teks yang akan ditampilkan kepada pengguna (UI labels, pesan error, notifikasi, dll.) **wajib** menggunakan **Bahasa Indonesia** yang baik dan benar.

## 3. Prinsip Kode & Kualitas

- **Keep It Simple (KIS):** Hindari kerumitan yang tidak perlu. Tulis kode yang jelas, ringkas, dan mudah dipahami.
- **Don't Repeat Yourself (DRY):** Gunakan kembali komponen dan logika jika memungkinkan untuk menghindari duplikasi kode.
- **Komponen Fungsional & Hooks:** Selalu gunakan komponen fungsional dengan React Hooks. Hindari komponen kelas.
- **TypeScript:** Gunakan TypeScript untuk semua file `.ts` dan `.tsx` untuk memastikan keamanan tipe dan mengurangi bug.
- **Tanpa Komentar:** Hindari menambahkan komentar di dalam kode, kecuali untuk bagian yang sangat kompleks yang benar-benar memerlukan penjelasan. Kode harus bisa menjelaskan dirinya sendiri.

## 4. Struktur Proyek

- **`/src/app`**: Berisi semua halaman dan rute aplikasi (menggunakan App Router dari Next.js).
- **`/src/components`**: Berisi semua komponen React yang dapat digunakan kembali.
  - **`/ui`**: Komponen dasar dari ShadCN (Button, Card, dll.).
  - **`/shared`**: Komponen yang digunakan di banyak halaman (Header, MainNav, dll.).
  - **Lainnya**: Komponen spesifik untuk fitur tertentu (misal: `/auth`, `/dashboard`).
- **`/src/lib`**: Berisi logika non-UI, utilitas, definisi tipe, dan data.
  - **`/data.ts`**: **Satu-satunya sumber data** untuk aplikasi saat ini (menggunakan `mockApi`).
  - **`/hooks`**: Berisi custom React Hooks (misal: `useAuth`).
  - **`/types.ts`**: Definisi tipe TypeScript global.
  - **`/utils.ts`**: Fungsi utilitas umum (misal: `cn` untuk classnames).
- **`/src/ai`**: Berisi semua logika terkait Kecerdasan Buatan (AI) menggunakan Genkit.

## 5. Styling & Antarmuka Pengguna (UI)

- **ShadCN/UI:** Prioritaskan penggunaan komponen dari direktori `src/components/ui` untuk membangun antarmuka.
- **Tailwind CSS:** Gunakan kelas utilitas Tailwind untuk styling. Hindari penulisan CSS manual atau inline-styles jika tidak benar-benar diperlukan.
- **Desain Konsisten:** Jaga konsistensi dalam hal warna, spasi, dan tipografi di seluruh aplikasi.
- **Responsif:** Pastikan semua halaman dan komponen terlihat baik di perangkat mobile maupun desktop.
- **Theming:** Perubahan warna global (primary, background, dll.) harus dilakukan di `src/app/globals.css` dengan memodifikasi variabel CSS HSL.

## 6. Manajemen State (Kondisi)

- **State Lokal:** Gunakan `useState` untuk state yang hanya relevan di dalam satu komponen.
- **State Global:** Gunakan `React.Context` (seperti yang ada di `useAuth`) untuk state yang perlu dibagikan ke seluruh aplikasi (misalnya, informasi pengguna yang sedang login). Hindari penggunaan pustaka manajemen state yang kompleks seperti Redux kecuali jika benar-benar diperlukan.

## 7. Pengambilan & Manipulasi Data

- **`mockApi`**: Untuk saat ini, semua operasi data (membaca, menulis, memperbarui) **harus** melalui fungsi-fungsi yang tersedia di `mockApi` dalam file `src/lib/data.ts`.
- **Asinkron:** Semua fungsi data di `mockApi` bersifat asinkron (`async/await`) untuk mensimulasikan panggilan API sebenarnya. Tangani status `loading` dan `error` dengan benar di komponen.

## 8. Prinsip Desain & Pengalaman Pengguna (UX)

- **Mudah Digunakan:** Aplikasi yang dibangun **harus** intuitif, tidak membingungkan, dan mudah dipahami oleh pengguna akhir (warga dan admin RT).
- **Alur yang Jelas:** Setiap fitur harus memiliki alur yang logis dan mudah diikuti.
- **Fokus pada Tujuan:** Tujuan utama aplikasi adalah menyederhanakan dan mengelola proses siskamling, bukan menambah kerumitan.
