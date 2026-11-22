# CIKO (KoinKita) — Ekspedisi Literasi Finansial Indonesia

Platform edugame literasi keuangan Indonesia gratis dan bebas iklan yang dibangun oleh **Radithya Aydin Aryasatya**.

## Kurikulum & Mekanisme Utama

- **Ekspedisi 6 Semester · 31 Unit · 175 Keping Materi**: Materi disusun berjenjang dari Kampung Transaksi (sejarah uang, keaslian Rupiah 3D, belanja cerdas) hingga Kota Kemandirian Ekonomi (LPS 3T, SBN Ritel, BI-Rate, Pajak PP 20/2026, pembukuan UMKM, serta KPR & *stress test* keluarga).
- **Buku Saku Resmi**: Setiap unit menyediakan rujukan ringkas konsep dan regulasi dari Bank Indonesia, OJK, LPS, dan KBBI.
- **Sistem 5 Nyawa & Menu Latihan**: Kesalahan pada jalur utama mengurangi 1 dari 5 nyawa dan tersimpan ke **Bank Kesalahan**. Pemain dapat menebus +1 nyawa gratis lewat **Tebus Kesalahan** atau **Flashcard Konsep** (maks. 2× per hari), 50 Koin Saku, atau dukungan teman di menu Sosial.
- **Tes Penempatan Bersama (TPB), UTS & UAS**: Peserta berpengalaman dapat mengikuti TPB 1× di awal untuk langsung ditempatkan hingga Semester 4.
- **Arena & Liga Mingguan**: Kompetisi mingguan 30 pemain per grup dari kasta Pemula hingga Master Kekayaan.

## Panduan Pengembangan & Build

### Prasyarat
- Node.js 18+
- Android SDK & Java JDK (untuk build APK Android)

### Perintah Lokal
```bash
npm install
npm run dev      # Server pengembangan lokal (http://localhost:3000)
npm run lint     # Typecheck TypeScript (tsc --noEmit)
npm run build    # Production build web (dist/)
```

### Build APK Android Aman (Capacitor)
Kredensial keystore **tidak disimpan di `build.gradle`**. Untuk membangun APK release secara lokal:
1. Salin `android/keystore.properties.example` menjadi `android/keystore.properties` (sudah tercantum di `.gitignore`).
2. Isi `storeFile`, `storePassword`, `keyAlias`, dan `keyPassword` pada `android/keystore.properties` (atau gunakan environment variable `KOINKITA_*`).
3. Jalankan:
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
```
Hasil APK release berada di `android/app/build/outputs/apk/release/koinkita-release.apk`.

## Hak Cipta & Lisensi

**Copyright © 2026 Radithya Aydin Aryasatya. All Rights Reserved.**  
Lihat berkas [LICENSE](./LICENSE) untuk ketentuan lengkap hak cipta aplikasi, kurikulum, dan maskot CIKO.
