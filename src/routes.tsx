import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import DashboardPage from '@/pages/Dashboard'
import DataDesaPage from '@/pages/DataDesa'
import DataDesaDetailPage from '@/pages/DataDesaDetail'
import IDMPage from '@/pages/IDM'
import PengajuanDanaDesaPage from '@/pages/PengajuanDanaDesa'
import PengajuanADDPage from '@/pages/PengajuanADD'
import APBDesPage from '@/pages/APBDes'
import SKAparatDesaPage from '@/pages/SKAparatDesa'
import SKBPDPage from '@/pages/SKBPD'
import ProfilDesaPage from '@/pages/ProfilDesa'
import BeritaAcaraMusrenbangPage from '@/pages/BeritaAcaraMusrenbang'
import SKKaderPosyanduPage from '@/pages/SKKaderPosyandu'
import RTLHPage from '@/pages/RTLH'
import BUMDesaPage from '@/pages/BUMDesa'
import DokumenPage from '@/pages/Dokumen'
import LaporanPage from '@/pages/Laporan'
import PengaturanPage from '@/pages/Pengaturan'
import NotFoundPage from '@/pages/NotFound'

export const router = createBrowserRouter(
  [
    {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'data-desa', Component: DataDesaPage },
      { path: 'data-desa/:desaId', Component: DataDesaDetailPage },
      { path: 'idm', Component: IDMPage },
      { path: 'pengajuan-dana-desa', Component: PengajuanDanaDesaPage },
      { path: 'pengajuan-add', Component: PengajuanADDPage },
      { path: 'apbdes', Component: APBDesPage },
      { path: 'sk-aparat-desa', Component: SKAparatDesaPage },
      { path: 'sk-bpd', Component: SKBPDPage },
      { path: 'profil-desa', Component: ProfilDesaPage },
      { path: 'berita-acara-musrenbang', Component: BeritaAcaraMusrenbangPage },
      { path: 'sk-kader-posyandu', Component: SKKaderPosyanduPage },
      { path: 'rtlh', Component: RTLHPage },
      { path: 'bum-desa', Component: BUMDesaPage },
      { path: 'dokumen', Component: DokumenPage },
      { path: 'laporan', Component: LaporanPage },
      { path: 'pengaturan', Component: PengaturanPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
], { basename: import.meta.env.BASE_URL })
