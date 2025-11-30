# Marketplace Usaha Warga

## 1. Deskripsi Fitur

Fitur ini menyediakan katalog usaha milik warga RT, misalnya:
- Warung makan
- Laundry
- Jasa servis
- Les privat
- Produk UMKM

Tujuan:
- Mendorong warga untuk saling mendukung ekonomi lokal (“belanja di tetangga dulu”).

---

## 2. Data Usaha Warga

Field:
- `id_usaha`
- `pemilik` (id_warga)
- `nama_usaha`
- `kategori` (makanan, jasa, edukasi, kerajinan, dll)
- `deskripsi`
- `alamat`
- `no_hp` / kontak WhatsApp
- `jam_buka` (opsional)
- `tautan_sosmed` / marketplace (opsional)
- `status` (aktif / nonaktif)

---

## 3. Hak Akses

- **Warga**
  - Menambahkan usaha milik sendiri (pending persetujuan Admin RT).
  - Melihat katalog usaha warga lain.
- **Admin RT**
  - Menyetujui / menolak / mengarsipkan listing usaha.
