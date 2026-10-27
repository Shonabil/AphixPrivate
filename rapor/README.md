# Folder Rapor

Simpan file rapor pemain di folder ini. Nama file = nama panggilan anak,
huruf kecil. Kalau nama panggilannya dua kata, ganti spasi dengan tanda strip (-).

Contoh:

| Nama panggilan | Nama file          |
| -------------- | ------------------ |
| Kafi           | `kafi.pdf`         |
| Rizky          | `rizky.jpg`        |
| Abang Rizky    | `abang-rizky.pdf`  |

Format yang dikenali: PDF, JPG, JPEG, PNG.

Orang tua membuka halaman `/rapor.html`, lalu mengetik nama panggilan anaknya
(besar-kecil huruf tidak masalah).

Coach juga bisa mengirim link langsung:

```
https://<domain-website>/rapor.html?nama=Kafi
```

Kalau ada dua anak dengan nama panggilan sama, bedakan nama filenya,
misalnya `rizky-a.pdf` dan `rizky-b.pdf`, lalu beri tahu orang tuanya.

Rapor periode baru: timpa file lama dengan nama yang sama.
