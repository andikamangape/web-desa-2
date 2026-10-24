# PROGRESS.md

## Fase Saat Ini
Fase 8 — Penyempurnaan, responsif, pengujian menyeluruh & persiapan demo: SELESAI

## Checklist Fase 8
- [x] Fix bug layout utama: sidebar sebelumnya tak terjangkau di desktop (tersembunyi permanen) — kini tampil tetap di md+ (`md:translate-x-0` + `md:pl-64`); di mobile tampil via hamburger dengan overlay + tombol Tutup + Escape
- [x] Tombol mati dihilangkan: Bell header kini menampilkan toast penjelasan (informatif); tombol "Lihat semua data demo" sidebar diganti link nyata ke /laporan
- [x] Modal (generik): kini menutup dengan Escape + body scroll-lock saat terbuka
- [x] NotFound: nesting `button` > `Link` valid diganti `useNavigate`; EmptyState 404 bahasa Indonesia
- [x] Responsif: padding konten `p-4 sm:p-6 md:p-8`, judul halaman kini tampil di header mobile, tabel semua halaman dibungkus `overflow-x-auto`, grid stat card 1/2/4 kolom
- [x] Header: judul dinamis untuk rute `/data-desa/:desaId` ("Data Desa — Detail Desa") dan fallback 404
- [x] Scroll-to-top otomatis tiap ganti rute; footer prototype dengan keterangan data demo di semua halaman
- [x] Sidebar: menutup overlay saat item menu diklik (mobile); catatan data demo di bagian bawah
- [x] Pengujian menyeluruh: `npx tsc --noEmit` 0 error, `npm run build` sukses, smoke test HTTP 19/19 rute (termasuk detail desa & 404) — semua 200
- [x] Semua 16 halaman sudah fungsional sebagai demo (tidak ada PlaceholderPage tersisa, kecuali NotFound yang memang halaman 404)

## File yang Dibuat/Changed (Fase 8)
- `src/App.tsx` (diubah) — layout responsif, Escape overlay, scroll-to-top, footer prototype
- `src/components/layout/Sidebar.tsx` (diubah) — link rekap data demo, close saat navigasi, catatan demo
- `src/components/layout/Header.tsx` (diubah) — toast notifikasi, judul mobile, judul detail desa/404
- `src/components/ui/Modal.tsx` (diubah) — Escape + scroll-lock
- `src/components/modules/ModulCrudPage.tsx` (diubah) — perapian header aksi
- `src/pages/NotFound.tsx` (diubah) — navigasi valid

## Panduan Demo (untuk persetujuan client)
1. **Dashboard** → stat card, grafik Recharts, rekap 11 modul, tabel progres 13 desa, aktivitas terbaru.
2. **Data Desa** → cari "Nagrak", filter status, sort, klik Detail → halaman detail (rute `/data-desa/desa-001`).
3. **Profil Desa** → Edit data Kepala Desa → Simpan → toast; refresh halaman: data tersimpan (localStorage).
4. Modul administrasi (mis. **IDM**, **APBDes**) → Tambah Data isi field wajib kosong → muncul error toast; isi lengkap → baris baru muncul; Detail → Edit → Hapus (konfirmasi).
5. **RTLH** → filter "Belum Diajukan", lihat baris "Belum Diisi" + tombol Tambah per baris; aksi cepat Verifikasi (ikon checklist hijau).
6. **BUM Desa** → switch tab "BUM Desa" ⇄ "BUM Desa Bersama".
7. **Laporan** → klik "Rekap per Modul (CSV)" → file .csv benar-benar terunduh (buka dengan Excel); coba juga tombol CSV per baris modul.
8. **Dokumen** → cari, filter, Detail; tombol Unduh menghasilkan file demo .txt (diinformasikan jujur di UI); tombol Upload menampilkan penjelasan.
9. **Pengaturan** → lihat daftar kunci `prototype-*` yang terdeteksi → Reset Semua Data Demo → semua modul kembali ke data awal (mock).
10. **Mobile** → hamburger di header, sidebar overlay; ters uji pada breakpoint md+.

## Pola Modul Generik
- Satu komponen ModulCrudPage menerima config per modul (field form, kolom tabel, storage key)
- Data awal dihasilkan dari MODUL_RINGKASAN sehingga angka Dashboard konsisten dengan modul
- Kunci localStorage: prototype-modul-{code}

## Fase Sebelumnya (riwayat ringkas)
- Fase 7 (Dokumen, Laporan, Pengaturan): selesai — katalog dokumen demo, ekspor CSV berfungsi dari data mock (per modul/rekap), profil aplikasi + reset data demo
- Fase 6 (RTLH & BUM): selesai — halaman RTLH khusus per desa + halaman BUM bertab (ModulContent generik), verifikasi badge & aksi cepat
- Fase 5 (8 modul generik): selesai — ModulCrudPage generik + config, 8 halaman modul, konsisten angka Dashboard
- Fase 4 (Profil Desa): selesai — halaman profil per desa dengan CRUD demo, localStorage, Modal generik, ConfirmDialog, toast
- Fase 3 (Dashboard & Data Desa): selesai — stat card, grafik Recharts, tabel 13 desa dengan cari/filter/sort/pagination, detail desa
- Fase 2 (Layout & design system): selesai — sidebar 3 grup menu, header, komponen UI, routing 16+1 rute
- Fase 1 (Inspeksi): workspace kosong, tanpa template Excel/CSV

## Cara Menjalankan
- `cd E:\web-app\web-desa-2 && npm run dev` (http://localhost:5173)
- `npm run build` (produksi)
- `npx tsc --noEmit` (typecheck)

## Catatan
Batas prototype: FRONTEND SAJA — React + Vite + Tailwind, data mock ditandai "demonstrasi", interaksi demo tersimpan di localStorage (bukan database), seluruh UI bahasa Indonesia, tanpa autentikasi. Semua fase (1–8) SELESAI. Prototype siap dipresentasikan untuk persetujuan client; struktur formulir menunggu validasi template Excel/CSV resmi dari client sebelum fase implementasi backend.

## Perubahan Data Desa (pasca-Fase 8)
- 13 desa mock diganti nama resmi desa di Kecamatan Lumbis Pansiangan, Kabupaten Nunukan, Kalimantan Utara: Sumentobol, Nantukidan, Labang, Sumantipal, Ngawol, Lagas, Bululaun Hilir, Panas, Tambalang Hulu, Kuyo, Bokok, Tantalujuk, Langgason (urutan sesuai permintaan; id & status/progres tetap).
- Kecamatan di set semua desa menjadi Lumbis Pansiangan; AKTIVITAS Dashboard, daftar desa peserta BUM Bersama, dan default Pengaturan ikut diperbarui.
- Verifikasi: tsc 0 error, build sukses. Catatan: jika browser demo sebelumnya sudah menyimpan perubahan di localStorage, lakukan Reset Data Demo di halaman Pengaturan agar data dokumen/BUM peserta versi baru dimuat.
