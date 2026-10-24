# IMPLEMENTATION_PLAN.md — Frontend Prototype Dashboard Administrasi 13 Desa

## Status
- Fase 1 — Inspeksi & Perencanaan: SELESAI
- Fase 2 — Design system, layout utama, sidebar, dan header: SELESAI
- Fase 3 — Dashboard dan Data Desa: SELESAI
- Fase 4 — Modul representatif (Profil Desa): SELESAI
- Fase 5 — Modul administrasi lainnya (IDM, DD, ADD, APBDes, SK Aparat, SK BPD, Musrenbang, SK Posyandu): SELESAI
- Fase 6 — RTLH dan BUM Desa berdasarkan template: SELESAI
- Fase 7 — Dokumen, Laporan, Pengaturan: SELESAI
- Fase 8 — Penyempurnaan responsif, interaksi, pengujian, persiapan demo: SELESAI

## Hasil Inspeksi Fase 1
- Workspace `E:\web-app\web-desa-2`: KOSONG (greenfield).
- Tidak ditemukan template Excel/CSV di workspace.
- Node.js v22.15.0, npm 10.9.2 tersedia.
- Referensi konvensi di `E:\web-app\frontend` (Vite, React 18, TS strict).

## Teknologi & Dependensi (terpasang)
- React 18 + TypeScript + Vite (port 5173)
- Tailwind CSS + PostCSS + Autoprefixer
- Lucide React (ikon)
- Recharts (grafik progres)
- React Router (navigasi)
- Sonner (toast notifikasi)
- clsx + tailwind-merge (utilitas cn)
- localStorage (persistensi demo, tersedia via hook)

## Struktur Direktori
```
web-desa-2/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── dist/ (hasil build)
├── src/
│   ├── main.tsx
│   ├── index.css
│   ├── App.tsx
│   ├── routes.tsx
│   ├── types/index.ts
│   ├── lib/utils.ts
│   ├── hooks/useToast.ts
│   ├── hooks/useLocalStorage.ts
│   ├── data/mockData.ts
│   ├── components/layout/{Sidebar,Header,PageShell,PlaceholderPage,LayoutContext}.tsx
│   ├── components/ui/{Button,Badge,Card,Table,Input,Select,Dialog,Spinner,Toast,EmptyState}.tsx
│   ├── pages/{Dashboard,DataDesa,DataDesaDetail,IDM,PengajuanDanaDesa,PengajuanADD,APBDes,SKAparatDesa,SKBPD,ProfilDesa,BeritaAcaraMusrenbang,SKKaderPosyandu,RTLH,BUMDesa,Dokumen,Laporan,Pengaturan,NotFound}.tsx
```

## Grup Menu Sidebar
1. Utama: Dashboard, Data Desa
2. Administrasi Desa: IDM, Pengajuan Dana Desa (DD), Pengajuan ADD, APBDes, SK Aparat Desa, SK BPD, Profil Desa, Berita Acara Musrenbang Desa, SK Kader Posyandu Desa, RTLH, BUM Desa & BUM Desa Bersama
3. Sistem: Dokumen, Laporan, Pengaturan

## Halaman (16 halaman, semuanya terhubung via routing)
- **Dashboard** (selesai Fase 3): 4 stat card (Total Desa 13, Lengkap, Dalam Proses, Belum Diisi), grafik Recharts progres per desa, rekap per modul, tabel kelengkapan 13 desa (sortable), aktivitas terbaru, tombol navigasi cepat, keterangan data mock.
- **Data Desa** (selesai Fase 3): tabel 13 desa, pencarian nama, filter status, pengurutan kolom, pagination (10/halaman), tombol detail.
- **Data Desa Detail** (selesai Fase 3): informasi desa, ringkasan status per modul (11 modul) dengan progres.
- Sisa 13 modul: PlaceholderPage dengan keterangan jujur "modul dalam pengembangan".
- NotFound: halaman 404 dengan tombol kembali.

## Data Mock (src/data/mockData.ts)
- DESAS: 13 desa dengan nama/kecamatan yang jelas merupakan demonstrasi (bukan data resmi client).
  - Lengkap: 4, Dalam Proses: 6, Belum Diisi: 3 (total 13).
- MODUL_RINGKASAN: 11 modul, masing-masing total=13, breakdown lengkap/dalamProses/belumDiisi konsisten (jumlah 143).
- AKTIVITAS: 7 aktivitas terbaru mock.
- getDesaDetailModulStatus(desaId): ringkasan status per modul untuk halaman detail.

## Keputusan Teknis
- Semua UI dalam bahasa Indonesia.
- Warna utama: biru tua (primary-600) dengan palet neutral.
- Badge status: Lengkap (hijau), Dalam Proses (kuning), Belum Diisi (merah).
- Path alias `@/` di tsconfig + vite config.
- Tidak ada `any`; strict TypeScript aktif.
- Semua menu utama mengarah ke halaman yang sesuai (tidak ada tombol mati).
- Build produksi berhasil (dist/ dihasilkan).
- Semua data ditandai jelas sebagai demonstrasi (mock), bukan data resmi / tidak tersimpan di database.

## Fase yang Akan Datang (rencana, belum dikerjakan)
- Fase 4-7: Modul administrasi (IDM, Pengajuan Dana Desa, Pengajuan ADD, APBDes, SK Aparat Desa, SK BPD, Profil Desa, Berita Acara Musrenbang, SK Kader Posyandu, RTLH, BUM Desa) berdasarkan template.
- Fase 8: Dokumen, Laporan, Pengaturan, responsif, pengujian, persiapan demo.

## Cara Menjalankan
1. `cd E:\web-app\web-desa-2`
2. `npm install` (sudah dilakukan)
3. `npm run dev` — berjalan di http://localhost:5173
4. `npm run build` — build produksi ke dist/
5. `npx tsc --noEmit` — TypeScript typecheck
