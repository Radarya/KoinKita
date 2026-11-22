import { SemesterSpec } from '../types';
import {
  REG_SOURCES,
  buildUAS,
  buildUTS,
  card,
  mkDetektifLesson,
  mkKokiLesson,
  mkPairLesson,
  mkQuizLesson,
  mkStoryLesson,
  mkWordleLesson,
} from '../helpers';

export const SEMESTER_3: SemesterSpec = {
  id: 'S3',
  semesterNumber: 3,
  titleId: 'Semester 3: Manajemen Utang, Keamanan Digital & Pemulihan Pasca-Insiden',
  titleEn: 'Semester 3: Debt Management, Digital Security & Incident Recovery',
  subtitleId: 'Beda bunga flat/efektif, SLIK OJK yang akurat, benteng OTP/CVV, pemulihan APK, hingga aturan LPBBTI/CAMILAN.',
  units: [
    // ================= UNIT 12 =================
    {
      id: 'S3.U12',
      unitNumber: 12,
      semesterId: 'S3',
      titleId: 'Utang Sehat vs Konsumtif & Cara Kerja PayLater',
      titleEn: 'Productive vs Consumptive Debt & PayLater',
      guidebook: {
        summaryId:
          'Utang produktif menambah aset atau kapasitas penghasilan dengan hitungan kas terukur, sedangkan utang konsumtif mendanai barang cepat susut. Sebagai pedoman umum literasi finansial rumah tangga, total cicilan sebaiknya di kisaran ≤ 30% penghasilan bersih (dibedakan dari ketentuan batas khusus produk LPBBTI OJK). Promo "Cicilan 0%" kerap tetap menyertakan biaya layanan bulanan atau admin di awal.',
        summaryEn: 'Productive vs consumptive debt, Debt Service Ratio guideline (~30%), and hidden PayLater fees.',
        keyRulesId: [
          'Komponen biaya utang selalu meliputi Pokok + Bunga + Biaya Admin/Layanan + Denda.',
          'Pedoman umum DSR ~30% adalah acuan literasi rumah tangga (dapat lebih ketat jika tanggungan keluarga besar).',
          'Selalu cek total uang keluar (nominal cicilan × tenor + biaya awal) sebelum menyetujui PayLater atau promo 0%.',
        ],
        keyRulesEn: [
          'Calculate total debt cost: Principal + Interest + Service/Admin Fees + Penalties.',
          'Keep total household EMIs reasonably low (~30% guideline).',
          'Always compute cumulative cash paid vs cash upfront price.',
        ],
        disclaimerId:
          'Catatan Edukasi: Batas DSR ~30% adalah pedoman literasi umum keluarga, berbeda dari aturan spesifik produk pinjaman daring LPBBTI OJK maupun kebijakan underwriting tiap bank.',
        disclaimerEn: 'Educational Guideline: ~30% DSR is a general household rule of thumb.',
      },
      stages: [
        {
          id: 'S3.U12.ST1',
          stageNumber: '12.1',
          titleId: 'Utang Produktif vs Konsumtif & Rasio Cicilan',
          titleEn: 'Productive vs Consumptive Loans & DSR',
          skipExamId: 'SKIP.S3.U12.ST1',
          paths: [
            mkWordleLesson('S3.U12.ST1.P1', 'Kosakata Dasar Kredit', 'Credit Vocabulary', 'Menguasai istilah pokok, tenor, cicil, agunan.', [
              { word: 'POKOK', clueId: 'Jumlah utang asli yang dipinjam sebelum ditambah bunga dan biaya layanan.', clueEn: 'Original borrowed loan principal.', definitionId: 'Nilai nominal dana murni yang diterima peminjam dan wajib dikembalikan.', definitionEn: 'Base loan principal amount.', exampleId: 'Pinjaman pokok Rp12 juta menjadi dasar perhitungan bunga dan cicilan bulanan.', exampleEn: 'Rp12M loan principal forms the repayment base.' },
              { word: 'TENOR', clueId: 'Jangka waktu pelunasan cicilan pinjaman yang disepakati di kontrak.', clueEn: 'Agreed loan repayment period.', definitionId: 'Durasi total angsuran kredit, misalnya 6 bulan, 12 bulan, atau 15 tahun KPR.', definitionEn: 'Duration of loan schedule.', exampleId: 'Memperpanjang tenor mengecilkan cicilan bulanan, tetapi memperbesar total bunga.', exampleEn: 'Longer tenor reduces monthly EMI but lifts total interest.' },
              { word: 'CICIL', clueId: 'Mengangsur pengembalian pinjaman berkala per bulan sesuai kesepakatan.', clueEn: 'Paying debt in regular installments.', definitionId: 'Pembayaran bertahap pokok beserta bunga/margin hingga lunas pada akhir tenor.', definitionEn: 'Periodic partial loan repayment.', exampleId: 'Menghitung dulu apakah total cicilan bulanan aman di bawah ~30% gaji bersih.', exampleEn: 'Checking total monthly EMIs against ~30% net income.' },
              { word: 'AGUNAN', clueId: 'Aset jaminan (mis. BPKB atau sertifikat rumah) pada fasilitas kredit berjaminan.', clueEn: 'Asset pledged as loan security.', definitionId: 'Harta yang diserahkan hak tanggungannya sebagai pengaman bagi pemberi pinjaman.', definitionEn: 'Collateral asset securing a loan.', exampleId: 'KPR memakai rumah yang dibeli sebagai agunan resmi bank.', exampleEn: 'A home mortgage uses the house as collateral.' },
            ]),
            mkKokiLesson('S3.U12.ST1.P2', 'Sortir Pinjaman Produktif Terukur vs Konsumtif Berisiko', 'Sort Productive vs Risky Loans', 'Memilah alasan kredit berdasarkan konteks arus kas nyata.', {
              instructionId: 'Pilah skenario pinjaman berikut berdasarkan konteks kas ke Produktif Terukur atau Konsumtif Berisiko.',
              instructionEn: 'Sort loan contexts into Measured Productive vs Risky Consumptive.',
              buckets: [
                { id: 'PRODUKTIF', labelId: 'PRODUKTIF TERUKUR', labelEn: 'MEASURED PRODUCTIVE', icon: '⚙️' },
                { id: 'KONSUMTIF', labelId: 'KONSUMTIF BERISIKO', labelEn: 'RISKY CONSUMPTIVE', icon: '🛍️' },
              ],
              items: [
                { id: 'ln1', contextTagId: 'Penjahit konveksi', labelId: 'Kredit mesin jahit saat pesanan seragam sudah antre & sisa kas mampu bayar cicilan', labelEn: 'Sewing machine loan backed by confirmed orders', correctBucketId: 'PRODUKTIF', explanationCard: card({ why: 'Menambah kapasitas produksi berpendapatan nyata dengan arus kas yang sudah terhitung.', next: 'Pastikan margin untung jauh di atas biaya cicilan.' }) },
                { id: 'ln2', contextTagId: 'Driver ojol aktif', labelId: 'Kredit motor kerja dengan sisa pendapatan bersih cukup setelah cicilan & bensin', labelEn: 'Work bike loan with healthy cash buffer', correctBucketId: 'PRODUKTIF', explanationCard: card({ why: 'Menjadi sarana mencari penghasilan harian dengan DSR terukur.', next: 'Siapkan dana cadangan servis berkala motor kerja.' }) },
                { id: 'ln3', contextTagId: 'Gaya hidup', labelId: 'Pakai PayLater untuk beli tiket konser & nongkrong akhir pekan', labelEn: 'PayLater for concert tickets & hangout', correctBucketId: 'KONSUMTIF', explanationCard: card({ why: 'Hiburan langsung habis nilainya dalam semalam sementara tagihan + biaya masih membebani bulan depan.', next: 'Gunakan tabungan hiburan atau Sinking Fund untuk acara konser.' }) },
                { id: 'ln4', contextTagId: 'Bisnis tanpa uji pasar', labelId: 'Berutang Rp25 juta bunga tinggi untuk bisnis coba-coba tanpa riset pembeli & cadangan kas', labelEn: 'High-interest debt for untested venture', correctBucketId: 'KONSUMTIF', explanationCard: card({ why: 'Utang usaha tanpa bukti permintaan dan tanpa dana cadangan sangat rentan gagal bayar di 3 bulan awal.', next: 'Validasi produk dengan modal kecil/tabungan dulu.' }) },
                { id: 'ln5', contextTagId: 'Janji untung cepat', labelId: 'Meminjam uang demi ikut investasi berjanji profit pasti harian', labelEn: 'Borrowing to chase guaranteed investment returns', correctBucketId: 'KONSUMTIF', explanationCard: card({ why: 'Menggabungkan utang (bunga pasti keluar) dengan spekulasi ilegal/volatil adalah resep kebangkrutan!', next: 'Investasi wajib memakai uang dingin yang sudah bebas utang konsumtif.' }) },
              ],
            }),
            mkQuizLesson('S3.U12.ST1.P3', 'Hitung Rasio Cicilan terhadap Pendapatan', 'Calculate Debt Service Ratio', 'Menghitung beban total cicilan sebelum mengambil kredit baru.', [
              {
                id: 's3u12s1p3_q1',
                promptId:
                  'Penghasilan bersih Rp5.000.000/bulan. Kamu sudah memiliki cicilan motor Rp1.200.000/bulan (24%). Kini ditawari cicilan gadget Rp650.000/bulan. Berapa rasio DSR total jika cicilan baru diambil?',
                promptEn: 'Net income Rp5M, existing bike EMI Rp1.2M, offered new gadget EMI Rp650k. Total DSR?',
                optionsId: ['37%', '13%', '24%', '50%'],
                optionsEn: ['37%', '13%', '24%', '50%'],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Ketika seluruh cicilan sudah menyedot 37% penghasilan bersih, ruang untuk makan pokok, Sinking Fund, dan guncangan darurat menyempit tajam.',
                  calc: '(1.200.000 + 650.000) ÷ 5.000.000 = 1.850.000 ÷ 5.000.000 = 37%.',
                  assume: 'Pedoman umum literasi rumah tangga ~30% penghasilan bersih (berbeda dari aturan produk LPBBTI spesifik OJK).',
                  next: 'Tunda gadget hingga cicilan motor selesai atau kumpulkan uang tunai di Tabungan Tujuan.',
                }),
              },
            ]),
          ],
        },
        {
          id: 'S3.U12.ST2',
          stageNumber: '12.2',
          titleId: 'Biaya Riil PayLater & "Cicilan 0%"',
          titleEn: 'Real Cost of PayLater & "0% Promo"',
          skipExamId: 'SKIP.S3.U12.ST2',
          paths: [
            mkQuizLesson('S3.U12.ST2.P1', 'Total Uang Keluar PayLater 12 Bulan vs Tunai', 'PayLater 12-Month Cost vs Cash', 'Menghitung selisih biaya riil PayLater vs menabung tunai.', [
              {
                id: 's3u12s2p1_q1',
                promptId:
                  'Harga tunai barang Rp3.000.000. Jika memilih PayLater 12 bulan dengan cicilan Rp310.000/bulan plus biaya admin awal Rp50.000, berapa total uang keluar dan selisih ekstranya dibanding beli tunai?',
                promptEn: 'Cash Rp3M vs PayLater 12 × Rp310k + Rp50k upfront fee. Total paid and extra cost?',
                optionsId: [
                  'Rp3.770.000 dengan selisih ekstra Rp770.000',
                  'Rp3.720.000 dengan selisih ekstra Rp720.000',
                  'Rp3.050.000 dengan selisih ekstra Rp50.000',
                  'Rp3.360.000 dengan selisih ekstra Rp360.000',
                ],
                optionsEn: [
                  'Rp3,770,000 with Rp770,000 extra cost',
                  'Rp3,720,000 with Rp720,000 extra cost',
                  'Rp3,050,000 with Rp50,000 extra cost',
                  'Rp3,360,000 with Rp360,000 extra cost',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Angka cicilan bulanan "cuma Rp310rb" menyembunyikan total selisih ekstra seperempat harga barang bila dijumlah 12 kali plus admin.',
                  calc: '(12 × 310.000) + 50.000 = 3.720.000 + 50.000 = Rp3.770.000 → Selisih = Rp770.000 (25,67%).',
                  next: 'Kalikan selalu nominal cicilan dengan jumlah bulan + biaya admin sebelum setuju mencicil.',
                }),
              },
            ]),
            mkDetektifLesson('S3.U12.ST2.P2', 'Audit Syarat Promo "Cicilan 0%"', 'Audit 0% Installment Traps', 'Membaca klausa tersembunyi pada penawaran cicilan 0%.', [
              {
                id: 'u12_dc1',
                channel: 'Tawaran',
                senderTitle: 'Banner Besar: "CICILAN BUNGA 0% 12 BULAN!" (*S&K Berlaku)',
                documentLines: [
                  '• Catatan huruf kecil: Dikenakan Biaya Layanan Bulanan 2,5%/bulan & Provisi 2% di muka',
                  '• Denda keterlambatan 5% jika melewati tanggal jatuh tempo',
                ],
                questionId: 'Apakah promo "Cicilan 0%" ini benar-benar gratis biaya tambahan?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA (RED FLAG): Bunga memang ditulis 0%, tetapi biaya layanan 2,5%/bln + provisi 2% menaikkan total bayar jauh di atas harga tunai!', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Karena tulisannya 0%, biaya layanan tidak pernah ditagihkan ke pembeli', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'AMAN: Provisi 2% otomatis kembali menjadi saldo cashback', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Banyak promo mengganti label "bunga" menjadi "biaya layanan/penanganan bulanan". Secara kas keluar, 2,5%/bln × 12 + 2% = tambahan ~32% dari harga!',
                  next: 'Selalu hitung total rupiah yang keluar sampai lunas, terlepas dari nama biayanya.',
                }),
              },
              {
                id: 'u12_dc2',
                channel: 'Tawaran',
                senderTitle: 'Klausul "Bunga Retroaktif" pada Promo 0% Alat Elektronik',
                documentLines: [
                  '• Cicilan 0% berlaku penuh hanya jika semua pembayaran tepat waktu',
                  '• Jika telat bayar 1 hari saja, promo 0% gugur & bunga normal dihitung surut sejak bulan ke-1',
                ],
                questionId: 'Apa hal penting yang harus diwaspadai dari klausul ini?',
                optionsId: [
                  { id: 'o1', labelId: 'WASPADA / PERLU DISIPLIN TINGGI: Satu kali telat bayar dapat menggugurkan seluruh 0% dan meledakkan bunga surut', verdict: 'WASPADA' },
                  { id: 'o2', labelId: 'AMAN: Telat bayar hanya didenda Rp1.000 tanpa memengaruhi promo', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'AMAN: Promo tetap 0% meski menunggak 3 bulan', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'fakta_terobservasi',
                explanationCard: card({
                  why: 'Membaca S&K klausul penalti mencegah kejutan tagihan retroaktif ketika lupa bayar satu hari.',
                  next: 'Gunakan pengingat atau autodebit hanya jika saldo terjamin mencukupi.',
                }),
              },
            ]),
          ],
        },
      ],
    },

    // ================= UNIT 13 (P0.3 SLIK OJK + P0.8 APR/EIR math!) =================
    {
      id: 'S3.U13',
      unitNumber: 13,
      semesterId: 'S3',
      titleId: 'Matematika Bunga, SLIK OJK & Strategi Pelunasan',
      titleEn: 'Interest Math, Credit History (SLIK OJK) & Payoff Strategies',
      regulationMeta: REG_SOURCES.SLIK_OJK,
      guidebook: {
        summaryId:
          'Bunga Flat dihitung terus dari pokok pinjaman awal padahal sisa pokok terus menurun: pinjaman Rp12jt 12 bln berbunga 1% flat/bln memiliki IRR ~1,788%/bln (~21,46% APR nominal atau ~23,70% EIR efektif tahunan). Pahami beda tegas: (1) SLIK OJK = sistem informasi netral pencatat riwayat kredit (bukan skor & bukan daftar hitam), (2) Kolektibilitas (Kol 1–5) = status pembayaran, (3) Credit Scoring = penilaian masing-masing pemberi kredit. Untuk pelunasan, gunakan Avalanche (bunga tertinggi dulu) atau Snowball (nominal terkecil dulu).',
        summaryEn: 'Flat vs effective APR/EIR math, exact distinction of SLIK OJK vs Collectibility vs Credit Scoring, and Avalanche/Snowball.',
        keyRulesId: [
          '1% flat/bulan selama 12 bulan BUKAN 12%/tahun efektif, melainkan ~21,46% nominal APR (~23,70% EIR)!',
          'SLIK OJK tidak memberi "Skor" dan tidak melakukan blacklist otomatis atas semua pekerjaan/beasiswa; pemberi kredit menilai permohonan KPR/kredit memakai data SLIK + faktor gaji, DSR, & agunan.',
          'Keluar dari lilitan cicilan memakai Snowball (motivasi) atau Avalanche (hemat bunga maksimal) tanpa gali lubang utang baru.',
        ],
        keyRulesEn: [
          '1% flat/month for 12m equals ~21.46% nominal APR (~23.70% EIR).',
          'SLIK OJK is a neutral credit history registry, not a scoring algorithm or universal job blacklist.',
          'Pay off debt cleanly with Snowball or Avalanche without taking toxic new loans.',
        ],
        disclaimerId: 'Referensi Regulasi: OJK (Sistem Layanan Informasi Keuangan / SLIK OJK, menggantikan BI Checking).',
        disclaimerEn: 'Regulatory Reference: OJK SLIK Debitur Information Rules.',
      },
      stages: [
        {
          id: 'S3.U13.ST1',
          stageNumber: '13.1',
          titleId: 'Bunga Flat vs Efektif & Riwayat Kredit SLIK OJK',
          titleEn: 'Flat vs Effective Math & SLIK OJK',
          skipExamId: 'SKIP.S3.U13.ST1',
          paths: [
            mkQuizLesson('S3.U13.ST1.P1', 'Mengapa 1% Flat/Bulan ≈ 21,46% APR / 23,70% EIR?', 'Flat vs Effective Exact Math', 'Memahami secara intuitif & matematis perbedaan bunga flat vs efektif.', [
              {
                id: 's3u13s1p1_q1',
                promptId:
                  'Pinjaman Rp12.000.000 tenor 12 bulan dengan bunga "1% flat/bulan" menghasilkan cicilan tetap Rp1.120.000/bulan (pokok Rp1jt + bunga tetap Rp120rb sampai bulan ke-12). Mengapa beban bunga tahunannya jauh di atas 12%?',
                promptEn: 'Rp12M for 12m at 1% flat/mo (Rp1,120,000/mo). Why is effective annual rate much higher than 12%?',
                optionsId: [
                  'Sisa pokok terus menyusut tiap bulan, tapi bunga tetap dihitung dari utuh Rp12jt',
                  'Bunga 1% flat digandakan majemuk tiap pekan oleh lembaga pemberi pinjaman resmi',
                  'Biaya admin di awal otomatis digabung ulang ke tingkat suku bunga efektif tahunan',
                  'Angsuran pokok seluruhnya baru mulai dibayar sekaligus di akhir bulan ke-12 nanti',
                ],
                optionsEn: [
                  'Remaining principal shrinks monthly while interest charges the initial Rp12M',
                  'Flat interest is compounded weekly into higher balances by official lenders',
                  'Upfront administration fees automatically fold directly into effective APR',
                  'Principal repayment stays zero until paid entirely in the twelfth final month',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Secara intuitif: rata-rata uang yang benar-benar kamu pegang sepanjang tahun hanya sekitar separuh dari Rp12jt (~Rp6,5jt), tetapi bunga tetap 1% ditagih dari utuh Rp12jt sampai bulan terakhir!',
                  calc: 'Cicilan = Rp1jt pokok + Rp120rb bunga = Rp1.120.000/bln (total bunga Rp1.440.000). IRR aktual = 1,788%/bln → Nominal APR (12 × IRR) = ~21,46%/th; Effective Annual Rate / EIR ((1 + IRR)^12 − 1) = ~23,70%/th!',
                  next: 'Saat membandingkan pinjaman, ubah bunga flat menjadi kisaran efektif/APR agar membandingkan secara setara.',
                }),
              },
              {
                id: 's3u13s1p1_q2',
                promptId:
                  '[Analitik HOTS] Untuk pinjaman modal usaha Rp6.000.000 selama 12 bulan, Pembiayaan A menawarkan "1,5% flat/bulan" tanpa admin, sedangkan Bank B menawarkan "18% efektif menurun/tahun" tanpa admin (total bunga anuitas setahun ≈ Rp601.000). Manakah yang total uang keluarnya lebih hemat?',
                promptEn: '[HOTS] For a Rp6M 12-month loan without fees: Lender A offers "1.5% flat/mo" vs Bank B offers "18% effective declining/yr" (~Rp601k total annuity interest). Which pays less total cash?',
                optionsId: [
                  'Bank B jauh lebih hemat total pembayarannya dibanding Pembiayaan A',
                  'Total bayar kedua skema sama persis karena keduanya 18% setahun',
                  'Pembiayaan A lebih hemat karena bunga tetap tidak membebani cicilan',
                  'Bank B lebih mahal karena skema efektif menghitung ulang saldo tiap semester',
                ],
                optionsEn: [
                  'Bank B pays noticeably less total cash out than Lender A',
                  'Both loans pay identical total amounts at 18% annualized cost',
                  'Lender A saves more because flat interest keeps monthly interest fixed',
                  'Bank B costs more because effective rates recalculate twice a year',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Ini jebakan perbandingan bunga paling umum (C4-C5): 1,5% × 12 = 18% flat TIDAK SAMA dengan 18% efektif menurun! Pada flat, bunga dihitung dari utuh Rp6jt setiap bulan meski pokok sudah dicicil.',
                  calc: 'A (1,5% flat): bunga = 12 × (1,5% × Rp6jt) = Rp1.080.000 → Total Rp7.080.000. B (18% efektif): bunga hanya ~Rp601.000 → Total ~Rp6.601.000 (hemat ~Rp479.000)!',
                  next: 'Selalu hitung total seluruh cicilan dikali tenor dalam rupiah sebelum memilih skema pinjaman.',
                  type: 'simulation_assumption',
                }),
              },
            ]),
            mkQuizLesson('S3.U13.ST1.P2', 'Bedakan SLIK OJK, Kolektibilitas & Credit Scoring', 'SLIK OJK vs Collectibility vs Credit Scoring', 'Memahami peran netral SLIK OJK tanpa mitos blacklist/penolakan universal.', [
              {
                id: 's3u13s1p2_q1',
                promptId: 'Pernyataan manakah yang paling TEPAT membedakan antara SLIK OJK, Kolektibilitas, dan Credit Scoring?',
                promptEn: 'Which statement accurately distinguishes SLIK OJK, Collectibility, and Credit Scoring?',
                optionsId: [
                  'SLIK catat riwayat netral; Kol 1–5 catat kelancaran; bank nilai skornya sendiri',
                  'SLIK mencetak skor tunggal 0–1000 yang otomatis memblokir seluruh lowongan kerja',
                  'Kolektibilitas 1–5 ditetapkan oleh negara guna mengunci paksa tabungan penunggak',
                  'Credit Scoring bank mengabaikan SLIK dan hanya melihat nominal gaji bersih harian',
                ],
                optionsEn: [
                  'SLIK logs neutral history; Kol 1-5 tracks repayment; each lender runs scoring',
                  'SLIK publishes a 0-1000 numeric score blocking nationwide job recruitment',
                  'Collectibility 1-5 is used by regulators to automatically freeze savings accounts',
                  'Bank Credit Scoring ignores SLIK history and only reviews gross paycheck amounts',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'SLIK OJK bukan pemberi skor dan bukan daftar hitam. Lembaga keuangan (bank/leasing/LPBBTI) membaca data riwayat & Kolektibilitas 1–5 di SLIK lalu menggabungkannya dengan faktor gaji, DSR, & agunan dalam Credit Scoring internal mereka.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.SLIK_OJK,
                  next: 'Menjaga Kol 1 (Lancar) pada seluruh fasilitas resmi menjaga kelayakan saat suatu hari mengajukan KPR atau modal usaha.',
                }),
              },
              {
                id: 's3u13s1p2_q2',
                promptId: 'Apa konsekuensi nyata yang paling sering terjadi jika seseorang membiarkan tagihan PayLater resmi menunggak hingga Kolektibilitas 4–5 (Macet)?',
                promptEn: 'Most realistic consequence of letting a licensed PayLater loan slip to Kol 4-5?',
                optionsId: [
                  'Pengajuan KPR atau kredit usaha berisiko ditolak hingga tunggakan lunas terbarui',
                  'Saldo tabungan di bank lain otomatis ditarik OJK untuk menutup tagihan pokok',
                  'Catatan Kol 4–5 hilang otomatis setelah 30 hari meski tagihan belum dibayar',
                  'Riwayat menunggak hanya terlihat di aplikasi yang sama, tidak lintas perbankan',
                ],
                optionsEn: [
                  'Future mortgage/business loan applications risk rejection until cleared and reported clean',
                  'Savings balances at unrelated banks are automatically seized by regulators directly',
                  'Kol 4-5 status erases automatically after 30 days even if principal stays unpaid',
                  'Overdue history stays isolated inside the original app and never reaches banks',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Tunggakan Kol 3–5 memperlihatkan risiko gagal bayar kepada analis bank saat menilai KPR/kredit baru; dampak pada rekrutmen umumnya terbatas pada seleksi institusi keuangan tertentu sesuai kebijakan, bukan larangan universal.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.SLIK_OJK,
                  next: 'Jika terlanjur menunggak karena musibah, segera hubungi pemberi pinjaman resmi untuk pelunasan atau restrukturisasi sah.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.SLIK_OJK }),
            mkWordleLesson('S3.U13.ST1.P3', 'Kosakata Bunga & Riwayat Kredit', 'Interest & SLIK Terms', 'Menguasai istilah flat, efektif, SLIK, dan denda.', [
              { word: 'FLAT', clueId: 'Skema bunga yang dihitung terus dari pokok awal sampai akhir tenor.', clueEn: 'Flat interest always charged on initial principal.', definitionId: 'Metode perhitungan bunga pinjaman yang persentasenya selalu dikalikan pokok awal.', definitionEn: 'Interest based on initial principal every month.', exampleId: 'Bunga 1% flat/bln selama 12 bln setara ~21,46% nominal APR.', exampleEn: '1% flat/mo over 12m equals ~21.46% APR.' },
              { word: 'EFEKTIF', clueId: 'Perhitungan bunga berdasarkan sisa pokok pinjaman yang terus berkurang setiap bulan.', clueEn: 'Interest calculated on declining remaining principal.', definitionId: 'Suku bunga yang mencerminkan biaya riil pinjaman seiring turunnya sisa pokok utang.', definitionEn: 'True declining-balance interest rate.', exampleId: 'KPR bank memakai bunga efektif sehingga porsi bunga tiap bulan berkurang saat pokok terbayar.', exampleEn: 'Mortgages apply effective interest on remaining principal.' },
              { word: 'SLIK', clueId: 'Sistem Layanan Informasi Keuangan OJK pencatat netral riwayat fasilitas kredit debitur.', clueEn: 'OJK neutral debtor credit history database.', definitionId: 'Layanan pelaporan informasi riwayat kredit dan Kolektibilitas 1–5 milik OJK (pengganti BI Checking).', definitionEn: 'OJK credit reporting information system.', exampleId: 'Bank mengecek riwayat kredit di SLIK OJK saat memproses pengajuan KPR.', exampleEn: 'Banks inspect SLIK OJK history when underwriting a KPR.' },
              { word: 'DENDA', clueId: 'Biaya tambahan akibat pembayaran cicilan melewati tanggal jatuh tempo.', clueEn: 'Late payment penalty charge.', definitionId: 'Sanksi finansial kontraktual karena keterlambatan pelunasan angsuran sesuai tenggat.', definitionEn: 'Contractual penalty for overdue installments.', exampleId: 'Membayar cicilan sebelum jatuh tempo menghindarkan denda harian dan menjaga Kol 1.', exampleEn: 'Paying on time avoids penalty fees and keeps Kol 1 clean.' },
            ]),
          ],
        },
        {
          id: 'S3.U13.ST2',
          stageNumber: '13.2',
          titleId: 'Strategi Pelunasan Snowball vs Avalanche',
          titleEn: 'Snowball vs Avalanche Payoff',
          skipExamId: 'SKIP.S3.U13.ST2',
          paths: [
            mkPairLesson('S3.U13.ST2.P1', 'Membandingkan Snowball, Avalanche & Restrukturisasi', 'Payoff Strategies Match', 'Mencocokkan metode pelunasan tanpa utang baru.', {
              mode: 'pairs',
              instructionId: 'Cocokkan strategi keluar dari lilitan cicilan dengan fokus utamanya.',
              instructionEn: 'Match each debt payoff strategy with its focus.',
              pairs: [
                { id: 'ps1', leftId: 'Metode Avalanche', leftEn: 'Avalanche Method', rightId: 'Prioritaskan pelunasan utang berbunga/biaya tertinggi dulu demi hemat biaya total maksimal', rightEn: 'Pay highest-rate debt first to minimize total interest' },
                { id: 'ps2', leftId: 'Metode Snowball', leftEn: 'Snowball Method', rightId: 'Prioritaskan melunasi pos utang nominal terkecil dulu agar jumlah tagihan cepat berkurang & menjaga motivasi', rightEn: 'Pay smallest balance first for psychological wins' },
                { id: 'ps3', leftId: 'Restrukturisasi Resmi', leftEn: 'Official Restructuring', rightId: 'Hubungi lembaga kredit legal saat gagal bayar karena musibah untuk negosiasi penjadwalan ulang/tenor', rightEn: 'Negotiate formal schedule relief with legal lender' },
              ],
              explanationCard: card({
                why: 'Baik Avalanche maupun Snowball tetap wajib membayar angsuran minimum seluruh utang lain lalu menumpuk sisa dana ekstra pada satu sasaran, hindari "gali lubang tutup lubang" ke pinjol baru!',
                next: 'Jika sanggup disiplin, Avalanche paling hemat rupiah; jika nyaris putus asa karena terlalu banyak pos kecil, Snowball menjaga semangat.',
              }),
            }),
            mkQuizLesson('S3.U13.ST2.P2', 'Urutkan Prioritas 3 Utang Nyata', 'Prioritize 3 Real Debts', 'Mempraktikkan urutan Avalanche vs Snowball pada kasus 3 tagihan.', [
              {
                id: 's3u13s2p2_q1',
                promptId:
                  'Kamu punya 3 utang: A (Rp5.000.000, bunga 3%/bulan), B (Rp1.000.000, bunga 2%/bulan), C (Rp3.000.000 ke orang tua, bunga 0%). Bila memakai metode AVALANCHE untuk memaksimalkan penghematan bunga, mana yang diberi bayar ekstra lebih dahulu (sambil tetap bayar minimum B)?',
                promptEn: 'Debts: A (Rp5M, 3%/mo), B (Rp1M, 2%/mo), C (Rp3M, 0%). Under Avalanche, which gets extra payment first?',
                optionsId: [
                  'Utang A dulu karena tingkat bunga 3%/bulan paling tinggi',
                  'Utang B dulu karena saldonya Rp1 juta bisa lunas tercepat',
                  'Utang C dulu karena tenggat waktu cicilannya paling longgar',
                  'Bagi rata ekstra ke A, B, dan C agar semua saldo turun sama',
                ],
                optionsEn: [
                  'Debt A first because its 3%/month interest rate is highest',
                  'Debt B first because its Rp1M balance closes soonest (Snowball)',
                  'Debt C first because family repayment schedule stays flexible',
                  'Split extra payments equally across A, B, and C each cycle',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Avalanche selalu membidik persentase bunga tertinggi (3%/bln pada A) guna menekan total bunga kumulatif sekecil mungkin.',
                  next: 'Catat bunga efektif tiap utangmu di satu tabel sebelum menentukan prioritas pelunasan.',
                }),
              },
            ]),
            mkStoryLesson('S3.U13.ST2.P3', 'Keluar dari Lingkaran 3 Cicilan', 'Debt Exit Plan', 'Menata ulang kas dan mengeksekusi rencana bebas cicilan tanpa utang baru.', {
              titleId: 'Keluar dari Lingkaran 3 Cicilan dalam 6 Bulan',
              subtitleId: 'Simulasi Pelunasan Terukur Tanpa Gali Lubang Tutup Lubang',
              durationLabelId: '3 Babak Simulasi',
              initialState: { cash: 500_000, emergencyFund: 500_000, sinkingFund: 0, debt: 9_000_000, netWorth: -8_000_000 },
              chapters: [
                {
                  id: 'u13_b1',
                  periodLabelId: 'Babak 1: Menghentikan Pendarahan Kas',
                  narrativeId: 'Kamu punya 3 utang (A berbunga 3%/bln, B 2%/bln, C 0%) serta beberapa barang hobi jarang terpakai senilai Rp1.200.000 dan langganan bocor Rp200.000/bln.',
                  choices: [
                    { id: 'c1', labelId: 'Hentikan langganan tak terpakai, jual barang hobi Rp1.200.000 untuk bayar ekstra Utang A (Avalanche), & bekukan PayLater', feedbackId: 'Langkah agresif sehat! Saldo pokok Utang A langsung turun signifikan tanpa menambah utang.', deltas: { cash: 200_000, debt: -1_200_000, netWorth: 1_400_000, scoreCashflow: 30, scoreGoal: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Cari pinjaman baru berbunga harian untuk menutupi cicilan A bulan ini', feedbackId: 'Gali lubang tutup lubang hanya memperbesar total utang dan memperburuk Kolektibilitas SLIK!', deltas: { debt: 2_000_000, netWorth: -2_000_000, scoreRisk: -30 } },
                  ],
                },
                {
                  id: 'u13_b2',
                  periodLabelId: 'Babak 2: Komunikasi Resmi saat Bulan Berat',
                  narrativeId: 'Di Bulan ke-3 omzet sampingan turun sementara hingga cicilan hampir mepet jatuh tempo.',
                  choices: [
                    { id: 'c1', labelId: 'Hubungi bank/leasing resmi lebih awal untuk mengecek opsi penjadwalan ulang / restrukturisasi sah sebelum menunggak', feedbackId: 'Profesional! Komunikasi dini mencegah denda penalti membengkak dan menjaga rekam kredit tetap terkelola.', deltas: { scoreRisk: 25, scoreSecurity: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Matikan nomor HP & abaikan tagihan agar lupa sejenak', feedbackId: 'Menghilang memicu denda berlipat dan menurunkan Kolektibilitas SLIK ke Kol 4–5.', deltas: { debt: 500_000, netWorth: -500_000, scoreRisk: -25 } },
                  ],
                },
                {
                  id: 'u13_b3',
                  periodLabelId: 'Babak 3: Penuntasan & Menjaga Kol 1',
                  narrativeId: 'Sebagian besar utang berbunga tinggi hampir lunas! Bagaimana sikap pasca-bebas cicilan?',
                  choices: [
                    { id: 'c1', labelId: 'Alihkan bekas uang cicilan ke Dana Darurat & Sinking Fund agar tidak terpaksa berutang lagi saat darurat nanti', feedbackId: 'Kebiasaan bebas utang berkelanjutan berhasil dibangun!', deltas: { emergencyFund: 1_500_000, debt: -1_500_000, netWorth: 3_000_000, scoreGoal: 30 }, isRecommended: true },
                    { id: 'c2', labelId: 'Langsung buka 3 cicilan konsumtif baru karena merasa gaji sudah lega kembali', feedbackId: 'Siklus utang konsumtif berulang kembali tanpa cadangan.', deltas: { debt: 3_000_000, scoreGoal: -20 } },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Bebas utang tercapai lewat kombinasi membekukan belanja cicilan baru, memprioritaskan bunga tinggi (Avalanche) atau pos kecil (Snowball), & membangun Dana Darurat.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.SLIK_OJK,
                next: 'Selanjutnya: lindungi data rahasia keuanganmu dari phishing & social engineering!',
              }),
            }),
          ],
        },
      ],
    },

    // ================= UNIT 14 =================
    {
      id: 'S3.U14',
      unitNumber: 14,
      semesterId: 'S3',
      titleId: 'Benteng Data Rahasia & Verifikasi Domain Resmi',
      titleEn: 'Secret Data Fortress & Official Domains',
      guidebook: {
        summaryId:
          'Untuk mengirim uang kepadamu, orang lain hanya butuh Nama + Nomor Rekening atau QRIS toko. Sebaliknya, PIN, Password, dan Kode OTP tidak boleh diberikan kepada siapa pun lewat telepon/WA/link. Khusus CVV (3 digit belakang kartu): DILARANG KERAS membagikan lewat chat/telepon/formulir mencurigakan, dan hanya dimasukkan sendiri oleh pemilik pada halaman checkout resmi terenkripsi merchant/payment gateway tepercaya.',
        summaryEn: 'Distinguishing public transfer info from OTP/PIN/Password/CVV sharing rules and spotting fake domains.',
        keyRulesId: [
          'Membagikan CVV lewat WA/telepon/CS palsu = BAHAYA MUTLAK; memasukkan CVV sendiri saat checkout resmi yang kamu mulai = penggunaan sah.',
          'Domain resmi lembaga negara Indonesia berakhiran .go.id (ojk.go.id, bi.go.id, pajak.go.id), waspadai domain tiruan berakhiran .xyz / .blogspot / .vip.',
          'Hindari mengakses mobile banking lewat jaringan WiFi publik tanpa perlindungan karena risiko penyadapan jaringan.',
        ],
        keyRulesEn: [
          'Never share CVV via chat/calls; enter CVV only yourself on verified official HTTPS checkouts.',
          'Official government agencies use .go.id domains.',
          'Avoid open public WiFi for mobile banking.',
        ],
        disclaimerId: 'Pedoman keamanan siber transaksi keuangan Indonesia.',
        disclaimerEn: 'Cybersecurity best practices for financial apps.',
      },
      stages: [
        {
          id: 'S3.U14.ST1',
          stageNumber: '14.1',
          titleId: 'Perlindungan Data Kritis & Domain Resmi',
          titleEn: 'Credential Protection & Official Domains',
          skipExamId: 'SKIP.S3.U14.ST1',
          paths: [
            mkKokiLesson('S3.U14.ST1.P1', 'Sortir Data Terima Dana vs Rahasia Mutlak', 'Sort Public vs Secret Credentials', 'Memilah informasi publik vs rahasia mutlak termasuk pembedaan CVV.', {
              instructionId: 'Pilah informasi berikut ke Aman Diberikan untuk Terima Dana atau Rahasia Mutlak (Dilarang Dibagikan via Chat/Telepon/Link).',
              instructionEn: 'Sort data into Safe to Share vs Strictly Secret.',
              buckets: [
                { id: 'TERIMA', labelId: 'AMAN (Untuk Terima Transfer)', labelEn: 'SAFE FOR INCOMING PAY', icon: '📥' },
                { id: 'RAHASIA', labelId: 'RAHASIA MUTLAK (Dilarang Bagi)', labelEn: 'SECRET (NEVER SHARE)', icon: '🔐' },
              ],
              items: [
                { id: 'dt1', contextTagId: 'Jualan online', labelId: 'Nomor rekening bank + nama pemilik untuk menerima pembayaran pembeli', labelEn: 'Bank account number & name for payout', correctBucketId: 'TERIMA', explanationCard: card({ why: 'Orang lain hanya memerlukan nama dan nomor rekening untuk mengirim uang masuk.', next: 'Tetap cek mutasi untuk verifikasi transfer.' }) },
                { id: 'dt2', contextTagId: 'Kasir toko', labelId: 'Kode QRIS resmi toko milik sendiri agar dipindai pembeli', labelEn: 'Store official merchant QRIS', correctBucketId: 'TERIMA', explanationCard: card({ why: 'QRIS Statis/Dinamis resmi memang dipajang untuk menerima pembayaran masuk.', next: 'Periksa berkala agar stiker tidak ditimpa oknum.' }) },
                { id: 'dt3', contextTagId: 'Chat mengaku CS', labelId: 'Membagikan kode OTP 6 digit dari SMS/WA kepada petugas mengaku bank', labelEn: 'Sharing 6-digit OTP to someone claiming to be bank CS', correctBucketId: 'RAHASIA', explanationCard: card({ why: 'OTP adalah kunci persetujuan transaksi terakhir! Memberikan OTP langsung membobol saldo.', next: 'Staf bank sah tidak pernah meminta OTP lewat telepon maupun chat.' }) },
                { id: 'dt4', contextTagId: 'Foto kartu fisik', labelId: 'Mengirim foto/3 digit CVV belakang kartu debit/kredit lewat WA atau form link promo', labelEn: 'Sending CVV via WhatsApp or promo link', correctBucketId: 'RAHASIA', explanationCard: card({ why: 'BEDA TEGAS: Memasukkan CVV sendiri di halaman checkout resmi terenkripsi (https) toko tepercaya yang memang kamu buka sah; tetapi MEMBAGIKANNYA lewat chat/telepon/link orang lain = bahaya pengurasan kartu!', next: 'Tutup stiker kecil atau jaga bagian belakang kartu fisik.' }) },
                { id: 'dt5', contextTagId: 'Akses rekening', labelId: 'PIN 6 digit m-banking & password email pemulihan akun', labelEn: 'Mobile banking PIN & main email password', correctBucketId: 'RAHASIA', explanationCard: card({ why: 'Siapa pun yang menguasai email utama dapat mereset berbagai akun keuangan.', next: 'Aktifkan verifikasi 2 langkah (2FA) pada email utama.' }) },
                { id: 'dt6', contextTagId: 'Tautan hadiah', labelId: 'Foto KTP + swafoto pegang KTP ke tautan situs undian tidak dikenal', labelEn: 'KTP selfie upload to random prize URL', correctBucketId: 'RAHASIA', explanationCard: card({ why: 'Foto KTP + swafoto dipakai penipu untuk membobol verifikasi KYC dan membuka pinjol ilegal atas namamu!', next: 'Hanya unggah KYC di aplikasi keuangan berizin OJK yang jelas.' }) },
              ],
            }),
            mkDetektifLesson('S3.U14.ST1.P2', 'Audit Social Engineering & Tarif Transfer Palsu', 'Social Engineering Audit', 'Mengenali CS palsu ubah tarif Rp150rb/bln & domain tiruan.', [
              {
                id: 'u14_dc1',
                channel: 'WhatsApp',
                senderTitle: 'Akun Bisnis Logo Bank: "Pemberitahuan Perubahan Skema Tarif Rp150.000/Bulan"',
                documentLines: [
                  '• Pesan berbunyi: "Jika setuju biaya tetap Rp2.500/tx, segera klik tombol BATALKAN TARIF Rp150rb"',
                  '• Mengarah ke situs `ubah-tarif-nasabah-id.my.id` yang meminta Nomor Kartu, PIN, & OTP',
                ],
                questionId: 'Apa modus di balik pesan WA perubahan tarif bank ini?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA (PHISHING): Penipuan klasik memanfaatkan rasa takut dipotong Rp150rb untuk memanen PIN & OTP!', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Harus cepat diisi sebelum terpotong Rp150rb otomatis', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'WASPADA: Isi hanya PIN saja tanpa OTP agar aman', verdict: 'WASPADA' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Penipu menciptakan kepanikan palsu ("dipotong Rp150.000/bulan!") agar korban tergesa mengisi kredensial pada domain bukan resmi bank.',
                  next: 'Jika ragu soal pengumuman tarif bank, cek langsung lewat call center resmi atau aplikasi m-banking asli (bukan klik link WA).',
                }),
              },
              {
                id: 'u14_dc2',
                channel: 'Email',
                senderTitle: 'Notifikasi Keamanan: Pengirim: `security@cs-bankku.verify-id.com`',
                documentLines: [
                  '• Alamat domain setelah simbol @ adalah `cs-bankku.verify-id.com` (bukan domain resmi bank)',
                  '• Mengancam akun diblokir dalam 2 jam jika tidak klik tombol verifikasi',
                ],
                questionId: 'Bagaimana hasil inspeksi domain email pengirim ini?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA (SPOOFING DOMAIN): Subdomain palsu; domain sebenarnya adalah verify-id.com', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Ada kata bankku berarti milik bank resmi', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'AMAN: Selama ada simbol gembok di browser', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'fakta_terobservasi',
                explanationCard: card({
                  why: 'Cara membaca domain asli adalah melihat bagian paling kanan sebelum garis miring pertama (verify-id.com), bukan kata tiruan di bagian depan.',
                  next: 'Selalu buka aplikasi bank langsung dari layar HP, jangan pernah login lewat tombol email.',
                }),
              },
            ]),
            mkPairLesson('S3.U14.ST1.P3', 'Verifikasi Domain Resmi Lembaga Indonesia', 'Verify Official Agency Domains', 'Mencocokkan lembaga resmi Indonesia dengan domain .go.id aslinya.', {
              mode: 'pairs',
              instructionId: 'Cocokkan lembaga/status resmi di Indonesia dengan alamat domain website yang benar.',
              instructionEn: 'Match each official institution with its verified domain.',
              pairs: [
                { id: 'dm1', leftId: 'Otoritas Jasa Keuangan (OJK)', leftEn: 'OJK', rightId: 'ojk.go.id / kontak157.ojk.go.id', rightEn: 'ojk.go.id' },
                { id: 'dm2', leftId: 'Bank Indonesia (BI)', leftEn: 'Bank Indonesia', rightId: 'bi.go.id / pintar.bi.go.id', rightEn: 'bi.go.id' },
                { id: 'dm3', leftId: 'Direktorat Jenderal Pajak (DJP)', leftEn: 'Tax Directorate (DJP)', rightId: 'pajak.go.id', rightEn: 'pajak.go.id' },
                { id: 'dm4', leftId: 'Domain Phishing Tiruan Waspada', leftEn: 'Fake Phishing Domain', rightId: 'bansos-resmi.blogspot.com / djp-refund.xyz', rightEn: 'Free/random non-.go.id domain' },
              ],
              explanationCard: card({
                why: 'Instansi pemerintah dan otoritas keuangan resmi Republik Indonesia secara konsisten memakai akhiran .go.id.',
                next: 'Simpan bookmark situs resmi agar tidak salah mengeklik iklan pencarian palsu.',
              }),
            }),
            mkWordleLesson('S3.U14.ST1.P4', 'Kosakata Benteng Siber', 'Cyber Security Terms', 'Menguasai istilah OTP, CVV, Phishing, Domain.', [
              { word: 'OTP', clueId: 'Kode sekali pakai untuk konfirmasi transaksi yang wajib dirahasiakan dari siapa pun.', clueEn: 'One-Time Password secret verification code.', definitionId: 'Kode dinamis sementara via SMS/app untuk otorisasi final transaksi atau login.', definitionEn: 'Temporary single-use authorization code.', exampleId: 'Jangan membacakan kode OTP ke penelepon yang mengaku dari bagian keamanan bank.', exampleEn: 'Never read an OTP aloud to callers.' },
              { word: 'CVV', clueId: 'Tiga digit pengaman di belakang kartu debit/kredit; jangan bagikan via chat/telepon.', clueEn: '3-digit card security code on back of card.', definitionId: 'Card Verification Value di balik kartu untuk belanja mandiri di halaman checkout resmi terenkripsi.', definitionEn: '3-digit card verification code for trusted HTTPS checkouts.', exampleId: 'Masukkan CVV hanya sendiri saat checkout situs resmi, jangan difoto atau dikirim via chat.', exampleEn: 'Never send card CVV photos over chat.' },
              { word: 'PHISHING', clueId: 'Teknik memancing korban ke tautan/form palsu agar menyerahkan PIN, OTP, atau password.', clueEn: 'Deceptive link trap stealing login credentials.', definitionId: 'Serangan rekayasa sosial lewat situs/pesan tiruan yang menyaru instansi tepercaya.', definitionEn: 'Fraudulent impersonation attack stealing data.', exampleId: 'Pesan WA pengubahan tarif Rp150rb/bln dengan link eksternal adalah phishing.', exampleEn: 'Fake bank tariff alerts carrying external login links.' },
              { word: 'DOMAIN', clueId: 'Nama alamat resmi situs web seperti ojk.go.id untuk membedakan situs asli vs tiruan.', clueEn: 'Website address hostname like ojk.go.id.', definitionId: 'Identitas alamat situs di internet tempat memeriksa keaslian instansi resmi (mis. .go.id).', definitionEn: 'Official host address identifying websites.', exampleId: 'Pastikan domain akhiran .go.id sebelum mengisi data layanan pemerintah.', exampleEn: 'Verify .go.id before submitting government info.' },
            ]),
            mkStoryLesson('S3.U14.ST1.P5', 'Perjalanan Dinas & 3 Jebakan Data', 'Business Trip Traps', 'Memilih jaringan aman dan menjaga kredensial saat bepergian.', {
              titleId: 'Perjalanan Dinas & 3 Jebakan Kredensial',
              subtitleId: 'Simulasi Keputusan WiFi Publik, CVV & Link CS Palsu',
              durationLabelId: '3 Babak Simulasi',
              initialState: { cash: 3_000_000, emergencyFund: 2_000_000, sinkingFund: 0, debt: 0, netWorth: 5_000_000 },
              chapters: [
                {
                  id: 'u14_b1',
                  periodLabelId: 'Babak 1: WiFi Bandara Terbuka',
                  narrativeId: 'Sambil menunggu pesawat di bandara, kamu harus segera mentransfer pembayaran hotel via mobile banking.',
                  choices: [
                    { id: 'c1', labelId: 'Matikan WiFi bandara gratis & gunakan jaringan data seluler pribadi yang terenkripsi', feedbackId: 'Aman! Mencegah penyadapan sesi jaringan di WiFi publik terbuka.', deltas: { scoreSecurity: 30, scoreRisk: 20 }, isRecommended: true },
                    { id: 'c2', labelId: 'Sambungkan WiFi "FREE_AIRPORT_FAST" tanpa kata sandi lalu langsung transfer m-banking', feedbackId: 'WiFi terbuka berisiko serangan Man-in-the-Middle yang mengintip lalu lintas data.', deltas: { scoreSecurity: -25 } },
                  ],
                },
                {
                  id: 'u14_b2',
                  periodLabelId: 'Babak 2: Membayar Tiket Online vs Permintaan CS Chat',
                  narrativeId: 'Di aplikasi resmi maskapai terenkripsi (https), form checkout meminta 3 digit CVV. Lima menit kemudian muncul WA mengaku petugas maskapai meminta kode OTP yang baru masuk.',
                  choices: [
                    { id: 'c1', labelId: 'Masukkan CVV sendiri secara mandiri hanya di checkout resmi maskapai, dan TOLAK tegas/blokir WA peminta OTP', feedbackId: 'Presisi! Kamu paham beda pengisian CVV mandiri di checkout resmi vs larangan mutlak memberi OTP ke chat.', deltas: { cash: -750_000, scoreSecurity: 35, scoreGoal: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Kirimkan foto depan-belakang kartu plus OTP ke WA mengaku petugas maskapai', feedbackId: 'Kartu langsung dipakai membobol transaksi tak dikenal!', deltas: { cash: -2_500_000, scoreSecurity: -35 } },
                  ],
                },
                {
                  id: 'u14_b3',
                  periodLabelId: 'Babak 3: Verifikasi Link Bantuan Pajak',
                  narrativeId: 'Menerima email pajak pengembalian dana ke domain `pajak-refund-ri.xyz`.',
                  choices: [
                    { id: 'c1', labelId: 'Abaikan link & cek status perpajakan langsung hanya di situs resmi pajak.go.id', feedbackId: 'Domain .go.id resmi menyelamatkan datamu dari situs tiruan!', deltas: { scoreSecurity: 25, scoreGoal: 20 }, isRecommended: true },
                    { id: 'c2', labelId: 'Klik tautan dan ketik NIK beserta sandi akun pajak di .xyz', feedbackId: 'Kredensial dicuri situs palsu!', deltas: { scoreSecurity: -25 } },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Keamanan digital bergantung pada 3 disiplin: jaringan pribadi, pengenalan domain .go.id/resmi, dan menjaga OTP/PIN serta tidak pernah membagi CVV lewat chat.',
                next: 'Hadapi Gerbang UTS Semester 3 sebelum mendalami respons insiden .APK & aturan LPBBTI!',
              }),
            }),
          ],
        },
      ],
    },

    // ================= UNIT 15 =================
    {
      id: 'S3.U15',
      unitNumber: 15,
      semesterId: 'S3',
      titleId: 'Modus Penipuan Modern, Judol & Incident Recovery',
      titleEn: 'Modern Scams, Online Gambling & Incident Recovery',
      regulationMeta: REG_SOURCES.IASC_OJK,
      guidebook: {
        summaryId:
          'Kenali → Hindari → Pulihkan Pasca-Insiden. Berhati-hatilah terhadap file .APK asing (berisiko menyalahgunakan izin baca SMS/notifikasi/aksesibilitas untuk mencuri kredensial, tidak otomatis menyedot OTP tanpa izin), AI Deepfake Voice, Task Scam, & fakta matematis Judol. Bila terlanjur terkompromi: blokir rekening via bank, ganti sandi DARI PERANGKAT BERSIH LAIN, AMANKAN SELURUH BUKTI SEBELUM menghapus .APK/reset pabrik, lalu lapor ke IASC (iasc.ojk.go.id, tanpa jaminan uang kembali 100%) dan Kepolisian.',
        summaryEn: 'Malicious APK permissions, Deepfake, Task Scam, Gambler house-edge math, and exact post-incident recovery sequence.',
        keyRulesId: [
          'Amankan bukti (chat, mutasi, resi, paket APK) DAN ganti sandi dari perangkat bersih LAIN sebelum menghapus aplikasi atau reset pabrik perangkat terinfeksi.',
          'Lapor IASC (iasc.ojk.go.id) mempercepat blokir rekening penampung & fund tracing, tetapi TIDAK menjamin 100% uang pasti kembali.',
          'Judul "15 Menit Pertama" adalah penanda urgensi simulasi edukatif, bukan SLA hukum/jaminan waktu pengembalian dana.',
        ],
        keyRulesEn: [
          'Preserve forensic evidence and rotate credentials on a separate clean device BEFORE wiping the compromised phone.',
          'IASC accelerates account freezing/tracing without guaranteeing 100% refund.',
          '"First 15 Minutes" signifies response urgency, not a legal SLA.',
        ],
        disclaimerId: 'Referensi Regulasi: Indonesia Anti-Scam Centre (iasc.ojk.go.id), Satgas PASTI & Kontak OJK 157.',
        disclaimerEn: 'Regulatory Reference: IASC OJK & Satgas PASTI incident channels.',
      },
      stages: [
        {
          id: 'S3.U15.ST1',
          stageNumber: '15.1',
          titleId: 'Serangan .APK & Social Engineering',
          titleEn: 'Malicious .APK & Deepfake Calls',
          skipExamId: 'SKIP.S3.U15.ST1',
          paths: [
            mkDetektifLesson('S3.U15.ST1.P1', 'Audit File .APK & Penyalahgunaan Izin SMS', 'Audit .APK Chat Traps', 'Mengenali jebakan berkas .APK & mekanisme penyalahgunaan izin.', [
              {
                id: 'u15_apk1',
                channel: 'WhatsApp',
                senderTitle: 'Nomor Tak Dikenal: "Kak mohon dicek: Lihat-Foto-Resi-JNE-412.apk (4,2 MB)"',
                documentLines: [
                  '• Pengirim mengaku kurir ekspedisi, mengirim berkas berekstensi `.apk`, bukan gambar `.jpg`',
                  '• Meminta memasang aplikasi & menyetujui izin baca SMS / notifikasi / aksesibilitas',
                ],
                questionId: 'Apa risiko sebenarnya dari file .APK asing ini?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA: Aplikasi .APK berbahaya berisiko menyalahgunakan izin baca SMS/notifikasi/aksesibilitas untuk mencuri OTP & akun m-banking!', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Semua resi kurir resmi selalu dikirim berbentuk file .apk di WhatsApp', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'WASPADA: Boleh instal asalkan langsung ditutup 5 menit kemudian', verdict: 'WASPADA' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Tidak setiap file .apk otomatis menyadap OTP tanpa izin, penyerang menipu korban untuk menginstal .apk lalu menyetujui izin akses SMS/Notifikasi/Accessibility sehingga OTP yang masuk dapat terbaca pelaku!',
                  next: 'Jangan pernah menginstal file .apk dari chat siapa pun; lacak paket hanya di aplikasi/situs resmi kurir.',
                }),
              },
              {
                id: 'u15_apk2',
                channel: 'WhatsApp',
                senderTitle: 'Undangan-Pernikahan-Digital.apk: Dari Nomor Kontak Teman Lama Diretas',
                documentLines: [
                  '• Ekstensi file terlihat berakhir `.apk`',
                  '• Mengingat pesan datang dari akun teman yang mungkin sudah diretas, pelaku menyebar otomatis',
                ],
                questionId: 'Apakah pesan .apk dari nomor teman yang dikenal otomatis aman?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA: Tidak! Akun teman bisa saja sedang dibajak; tetap tolak instal .apk apa pun via chat', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Kalau nomor teman sendiri pasti undangan resmi nikahan', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'AMAN: Cukup lihat ukurannya kecil berarti aman', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Undangan pernikahan digital asli berupa tautan web resmi atau gambar/PDF, bukan installer aplikasi Android (.apk).',
                  next: 'Hubungi teman lewat jalur lain untuk memperingatkan jika akunnya membajak daftar kontak.',
                }),
              },
            ]),
            mkDetektifLesson('S3.U15.ST1.P2', 'Tangkal Suara AI Deepfake & Telepon Darurat', 'Counter Emergency Deepfake Scams', 'Mendeteksi rekayasa kepanikan darurat mengatasnamakan kerabat.', [
              {
                id: 'u15_df1',
                channel: 'SMS',
                senderTitle: 'Telepon Nomor Asing: Suara Mirip Adik Menangis Minta Transfer Rp5jt Kecelakaan!',
                documentLines: [
                  '• Penelpon memakai suara mirip kerabat, melarang menutup telepon: "Jangan tutup, langsung transfer ke rekening dokter ini sekarang!"',
                  '• Rekening tujuan bukan atas nama kerabat maupun rumah sakit resmi',
                ],
                questionId: 'Tindakan paling aman menghadapi situasi panik seperti ini adalah...',
                optionsId: [
                  { id: 'o1', labelId: 'WASPADA / VERIFIKASI SILANG: Tutup telepon sepihak, hubungi langsung nomor asli kerabat / video call / cek kata sandi keluarga sebelum transfer', verdict: 'WASPADA' },
                  { id: 'o2', labelId: 'AMAN: Langsung transfer Rp5 juta karena suaranya persis suara adik', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'AMAN: Kirim separuh dulu agar penelpon tenang', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'perlu_verifikasi',
                explanationCard: card({
                  why: 'Teknologi kloning suara AI (Deepfake Voice) mampu meniru suara dari potongan video media sosial. Kepanikan mendadak dibuat agar korban tak sempat memverifikasi fakta.',
                  next: 'Sepakati kata sandi darurat keluarga dan selalu verifikasi silang lewat panggilan balik ke nomor tersimpan.',
                }),
              },
            ]),
            mkPairLesson('S3.U15.ST1.P3', 'Protokol Verifikasi Darurat Keluarga', 'Family Emergency Verification Flow', 'Mengurutkan langkah verifikasi tenang saat menerima kabar darurat.', {
              mode: 'sequence',
              instructionId: 'Urutkan 4 langkah menghadapi telepon darurat mencurigakan yang mengatasnamakan kerabat.',
              instructionEn: 'Order the 4 verification steps when getting a frantic emergency call.',
              sequenceSteps: [
                { id: 'em1', labelId: 'Tahan diri, tetap tenang, dan JANGAN lakukan transfer apa pun di tengah telepon berlangsung', labelEn: 'Stay calm & refuse live transfer', order: 1 },
                { id: 'em2', labelId: 'Tutup panggilan telepon sepihak meski penelpon terus mengancam atau memaksa', labelEn: 'Hang up immediately', order: 2 },
                { id: 'em3', labelId: 'Hubungi langsung nomor HP asli kerabat atau orang serumah lain yang tersimpan di kontakmu', labelEn: 'Call relative real saved number or another family member', order: 3 },
                { id: 'em4', labelId: 'Lakukan verifikasi visual (video call) atau konfirmasi kata sandi keamanan keluarga', labelEn: 'Verify via video call or family safe word', order: 4 },
              ],
              explanationCard: card({
                why: 'Memutus kontak sepihak menghilangkan tekanan emosional penipu dan memberi ruang pengecekan fakta secara objektif.',
                next: 'Ajarkan protokol sederhana ini kepada orang tua di rumah.',
              }),
            }),
          ],
        },
        {
          id: 'S3.U15.ST2',
          stageNumber: '15.2',
          titleId: 'Jebakan Tugas Fiktif & Matematika Judi Online',
          titleEn: 'Task Scams & Online Gambling Math',
          skipExamId: 'SKIP.S3.U15.ST2',
          paths: [
            mkDetektifLesson('S3.U15.ST2.P1', 'Membongkar Pola Bertahap Task Scam', 'Expose Task Scam Stages', 'Mengaudit tugas like-follow berhadiah uang lalu dijebak deposit VIP.', [
              {
                id: 'u15_ts1',
                channel: 'WhatsApp',
                senderTitle: 'Kerja Paruh Waktu Like Video: Tahap 1 Dibayar Rp25rb → Tahap 2 Wajib Setor Deposit Rp2jt',
                documentLines: [
                  '• Hari 1: Tugas like/subscribe benar-benar dibayar Rp25.000 untuk membangun kepercayaan',
                  '• Hari 2: Dimasukkan ke grup VIP dan diwajibkan setor deposit "Tugas Konsolidasi Rp2.000.000" agar saldo bonus cair',
                ],
                questionId: 'Pola apakah yang terjadi di balik grup kerja paruh waktu ini?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA (TASK SCAM): Umpan uang kecil di awal untuk memancing setoran deposit besar yang tidak akan pernah cair!', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Sudah terbukti membayar Rp25.000 jadi setor Rp2jt pasti aman', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'WASPADA: Ajak teman ikut patungan agar deposit cepat terkumpul', verdict: 'WASPADA' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Task Scam sengaja membayar nominal kecil di awal untuk melumpuhkan kewaspadaan korban, lalu menciptakan alasan "kesalahan klik" agar korban terus mentransfer top-up deposit susulan.',
                  next: 'Jika sebuah pekerjaan meminta kamu menyetor modal/deposit agar gaji cair, segera hentikan semua komunikasi.',
                }),
              },
            ]),
            mkQuizLesson('S3.U15.ST2.P2', 'Fakta Matematis Kerugian Judi Online', 'Mathematical Reality of Online Gambling', 'Memahami house edge negatif dan jebakan psikologis judi online.', [
              {
                id: 's3u15s2p2_q1',
                promptId: 'Secara matematis, mengapa pemain Judi Online (Judol) pasti dirugikan dalam jangka panjang meski sesekali terlihat menang di awal?',
                promptEn: 'Why do online gambling players lose mathematically over time despite early wins?',
                optionsId: [
                  'Sistem ber-expected value negatif (house edge) yang memihak bandar',
                  'Menang beruntun di awal membuktikan peluang profit panjang pasti naik',
                  'Melipatgandakan taruhan tiap kalah menjamin seluruh modal kembali utuh',
                  'Platform judi wajib membagi pengembalian 100% adil bagi tiap akun aktif',
                ],
                optionsEn: [
                  'Negative expected value / house edge favors the operator over volume',
                  'Early winning streaks signal mathematical edge shifting to the player',
                  'Doubling stake after every loss (martingale) guarantees modal recovery',
                  'Platforms return 100% of pooled wagers fairly across all players',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Selain melanggar hukum di Indonesia, sistem bandar judi dibangun dengan house edge matematis negatif bagi pemain serta rekayasa efek "nyaris menang" untuk memicu keinginan mengejar kekalahan.',
                  next: 'Jika ada orang dekat terjerat Judol, segera putus akses, blokir aplikasi judi, & alihkan anggaran ke dukungan pemulihan dan manajemen utang.',
                }),
              },
            ]),
            mkWordleLesson('S3.U15.ST2.P3', 'Kosakata Kejahatan Digital & Pelaporan', 'Cyber Crime & IASC Terms', 'Menguasai istilah troyan, rekayasa, sengketa, IASC.', [
              { word: 'TROYAN', clueId: 'Aplikasi palsu (mis. file .APK undangan) yang menyamar aman padahal mencuri akses data.', clueEn: 'Disguised malware payload stealing access.', definitionId: 'Program berbahaya yang menyaru aplikasi biasa agar diinstal lalu menyalahgunakan izin perangkat.', definitionEn: 'Trojan malware disguised as a harmless file.', exampleId: 'File Undangan.apk yang meminta izin akses SMS adalah bentuk troyan.', exampleEn: 'Fake invitation APK requesting SMS permissions.' },
              { word: 'REKAYASA', clueId: 'Manipulasi psikologis agar korban sukarela memberi OTP atau mentransfer dana.', clueEn: 'Psychological social engineering manipulation.', definitionId: 'Rekayasa sosial: taktik memanfaatkan panik, takut, atau serakah demi membobol keamanan.', definitionEn: 'Manipulating human behavior rather than systems.', exampleId: 'Penelepon pura-pura CS bank memicu kepanikan tarif Rp150rb agar korban sebut OTP.', exampleEn: 'Caller triggers panic to extract OTP.' },
              { word: 'SENGKETA', clueId: 'Pengajuan resmi keberatan atau pembantahan transaksi tidak sah di bank atau platform.', clueEn: 'Official unauthorized transaction dispute.', definitionId: 'Proses klaim tertulis melalui mekanisme resmi lembaga keuangan atas transaksi bermasalah.', definitionEn: 'Formal dispute process for unauthorized charges.', exampleId: 'Menghubungi call center bank membuka tiket sengketa transaksi kartu.', exampleEn: 'Calling the bank to dispute unauthorized card charges.' },
              { word: 'IASC', clueId: 'Indonesia Anti-Scam Centre (iasc.ojk.go.id) untuk koordinasi blokir rekening penipu & fund tracing.', clueEn: 'OJK anti-scam coordination portal.', definitionId: 'Pusat penanganan penipuan transaksi keuangan OJK & Satgas PASTI untuk memblokir aliran dana pelaku.', definitionEn: 'Indonesian anti-scam fund-tracing and blocking center.', exampleId: 'Melapor cepat ke iasc.ojk.go.id memperbesar peluang blokir rekening penampung sebelum saldo ditarik.', exampleEn: 'Reporting swiftly to IASC OJK helps freeze fraudster accounts.' },
            ]),
          ],
        },
        {
          id: 'S3.U15.ST3',
          stageNumber: '15.3',
          titleId: 'Incident Response & Financial Recovery',
          titleEn: 'Incident Response & Recovery',
          skipExamId: 'SKIP.S3.U15.ST3',
          paths: [
            mkPairLesson('S3.U15.ST3.P1', 'Urutan Pemulihan Darurat & Simpan Bukti Pasca-Insiden', 'Critical Post-Incident Recovery Sequence', 'Mengurutkan tindakan blokir, ganti sandi di perangkat bersih, & amankan bukti SEBELUM reset.', {
              mode: 'sequence',
              instructionId:
                'Urutkan 5 langkah penyelamatan yang tepat ketika perangkat diduga terpasang .APK berbahaya atau kebocoran akun (catatan: amankan bukti & ganti sandi dari perangkat bersih LAIN sebelum menghapus aplikasi/reset pabrik!).',
              instructionEn: 'Order the 5 post-compromise recovery steps safely.',
              sequenceSteps: [
                { id: 'rec1', labelId: 'Hubungi Call Center resmi bank / e-wallet untuk blokir rekening, kartu, & akses m-banking sementara', labelEn: 'Call official bank/e-wallet to freeze account immediately', order: 1 },
                { id: 'rec2', labelId: 'Gunakan PERANGKAT LAIN YANG TEPERCAYA (bersih) untuk mengganti sandi email utama, akun keuangan, & aktifkan 2FA', labelEn: 'Change email/bank passwords & 2FA from ANOTHER CLEAN DEVICE', order: 2 },
                { id: 'rec3', labelId: 'Putuskan internet perangkat terdampak & AMANKAN SELURUH BUKTI (chat, resi transfer, mutasi, detail .APK) SEBELUM hapus/reset', labelEn: 'Disconnect infected device & SAVE ALL EVIDENCE before deleting app or resetting', order: 3 },
                { id: 'rec4', labelId: 'Hapus .APK / reset pabrik perangkat terdampak, lalu kirim laporan ke IASC (iasc.ojk.go.id) & Kepolisian', labelEn: 'Wipe/reset infected phone, then report to IASC OJK & Police', order: 4 },
                { id: 'rec5', labelId: 'Pantau mutasi lanjutan secara berkala & cabut izin perangkat/autodebit yang tidak dikenal', labelEn: 'Monitor statements & revoke unauthorized linked devices', order: 5 },
              ],
              explanationCard: card({
                why: 'Jika langsung factory reset tanpa mengamankan bukti, tangkapan layar chat dan data pelaku hilang sebelum dilampirkan ke IASC/Polisi. Ganti sandi wajib lewat perangkat LAIN yang bersih agar pengintai .APK tidak membaca sandi baru!',
                type: 'dynamic_fact',
                reg: REG_SOURCES.IASC_OJK,
                next: 'Catat nomor Call Center resmi bank yang kamu gunakan jauh hari sebelum krisis terjadi.',
              }),
            }, { st: 'dynamic_fact', reg: REG_SOURCES.IASC_OJK }),
            mkQuizLesson('S3.U15.ST3.P2', 'Peran IASC OJK, Batas Peluang & Laporan Polisi', 'IASC Role, Limits & Police Report', 'Memahami fungsi IASC tanpa janji pengembalian 100% serta peran Laporan Polisi.', [
              {
                id: 's3u15s3p2_q1',
                promptId: 'Apa fungsi utama portal resmi IASC (iasc.ojk.go.id) saat korban melaporkan penipuan transfer?',
                promptEn: 'Main role of IASC (iasc.ojk.go.id) when reporting scam transfers?',
                optionsId: [
                  'Koordinasi blokir rekening penampung pelaku & pelacakan aliran dana cepat',
                  'Menjamin pengembalian dana korban 100% langsung dari kas negara seketika',
                  'Menggantikan laporan polisi untuk memproses pidana pelaku di pengadilan',
                  'Membatalkan otomatis mutasi transfer yang sudah keburu ditarik tunai',
                ],
                optionsEn: [
                  'Rapid account freeze coordination & fund tracing across banks',
                  'Guaranteeing 100% state reimbursement regardless of withdrawn funds',
                  'Replacing criminal police prosecution against scam operators',
                  'Reversing settled transfers already cashed out by fraudsters',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'IASC mengoordinasikan bank dan penyedia pembayaran untuk menahan saldo tersisa di rekening penampung pelaku secara cepat, namun tidak menjamin dana 100% kembali karena bergantung pada sisa dana yang belum keburu ditarik pelaku.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.IASC_OJK,
                  next: 'Semakin cepat laporan dikirim beserta bukti rekening tujuan, semakin besar peluang blokir berhasil.',
                }),
              },
              {
                id: 's3u15s3p2_q2',
                promptId: 'Mengapa selain melapor ke bank & IASC, korban tetap perlu membuat Laporan Polisi resmi?',
                promptEn: 'Why file an official Police report in addition to Bank/IASC?',
                optionsId: [
                  'Menempuh jalur penyidikan hukum pidana sekaligus melengkapi bukti resmi',
                  'Agar bank wajib mengganti penuh 100% kerugian begitu surat lapor terbit',
                  'Karena sistem IASC melarang aduan nasabah jika tidak membawa surat polisi',
                  'Agar kepolisian dapat membekukan rekening tanpa perlu melewati pihak bank',
                ],
                optionsEn: [
                  'Pursuing criminal law enforcement alongside formal supporting documentation',
                  'To obligate banks to cover 100% losses immediately upon police report issue',
                  'Because IASC blocks victim submissions without an existing police report',
                  'So police can directly freeze bank ledgers without bank system channels',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'IASC berfokus pada koordinasi pemblokiran sistem pembayaran, sedangkan Kepolisian menangani aspek penyidikan pidana dan berita acara resmi.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.IASC_OJK,
                  next: 'Simpan tanda bukti lapor polisi dan nomor tiket IASC secara rapi.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.IASC_OJK }),
            mkKokiLesson('S3.U15.ST3.P3', 'Sortir Pemulihan Sah vs Jebakan Recovery Scam', 'Valid Recovery vs Recovery Scam', 'Membedakan jalur resmi dari penipuan kedua berkedok jasa hack/refund.', {
              instructionId: 'Pilah tindakan pasca-tertipu ke Langkah Pemulihan Sah atau Recovery Scam (Penipuan Kedua).',
              instructionEn: 'Sort actions into Legitimate Recovery vs Recovery Scam.',
              buckets: [
                { id: 'SAH', labelId: 'LANGKAH PEMULIHAN SAH', labelEn: 'VALID RECOVERY', icon: '🛡️' },
                { id: 'SCAM', labelId: 'RECOVERY SCAM (PENIPUAN KEDUA)', labelEn: 'RECOVERY SCAM', icon: '🕸️' },
              ],
              items: [
                { id: 'rc1', contextTagId: 'Pasca-klik APK', labelId: 'Blokir rekening via bank resmi, amankan bukti sebelum reset, & ganti sandi dari HP lain yang bersih', labelEn: 'Freeze bank, save evidence, rotate passwords on clean phone', correctBucketId: 'SAH', explanationCard: card({ why: 'Menghentikan akses pelaku dengan benar tanpa melenyapkan barang bukti.', next: 'Aktifkan 2FA dengan aplikasi autentikator jika memungkinkan.' }) },
                { id: 'rc2', contextTagId: 'Pelaporan resmi', labelId: 'Lapor cepat melalui kanal resmi bank, iasc.ojk.go.id, Kontak OJK 157, & Kepolisian', labelEn: 'Report officially via bank, IASC OJK 157 & Police', correctBucketId: 'SAH', explanationCard: card({ why: 'Satu-satunya jalur berwenang resmi melakukan pelacakan dana & penegakan hukum.', next: 'Waspadai akun palsu di media sosial yang mengatasnamakan otoritas.' }) },
                { id: 'rc3', contextTagId: 'Komentar IG/TikTok', labelId: 'Membayar "jasa hacker profesional" di media sosial yang berjanji meretas balik 100% uang korban', labelEn: 'Paying social media "hacker" claiming 100% money recovery', correctBucketId: 'SCAM', explanationCard: card({ why: 'Penipuan berulang (Recovery Scam)! Pelaku memanfaatkan keputusasaan korban untuk memeras biaya muka tambahan.', next: 'Tidak ada jasa perorangan legal yang bisa meretas balik saldo rekening bank.' }) },
                { id: 'rc4', contextTagId: 'DM mengatasnamakan IASC', labelId: 'Klik DM akun palsu mengaku staf IASC yang meminta transfer biaya verifikasi atau kode OTP demi "pencairan refund"', labelEn: 'DM fake IASC agent asking upfront fee or OTP for refund', correctBucketId: 'SCAM', explanationCard: card({ why: 'Layanan pelaporan IASC resmi GRATIS dan tidak pernah menagih biaya pencairan maupun meminta OTP lewat DM.', next: 'Hanya akses portal langsung di domain .go.id.' }) },
              ],
            }),
            mkStoryLesson('S3.U15.ST3.P4', 'Simulasi 15 Menit Pertama Penyelamatan Aset', 'Rapid Incident Response', 'Menangani insiden APK secara urut tanpa panik (catatan: judul penekanan urgensi respons cepat, bukan SLA refund 15 menit).', {
              titleId: 'Simulasi 15 Menit Pertama Penyelamatan Aset Keluarga',
              subtitleId: 'Pentingnya Respons Tanggap Cepat Saat Keadaan Darurat',
              durationLabelId: '3 Babak Simulasi',
              initialState: { cash: 4_000_000, emergencyFund: 2_000_000, sinkingFund: 0, debt: 0, netWorth: 6_000_000 },
              chapters: [
                {
                  id: 'u15_b1',
                  periodLabelId: 'Menit ke-1: Kerabat Terlanjur Instal `Paket-Kurir.apk`',
                  narrativeId: 'Kerabatmu baru saja menginstal .APK asing dan mengizinkan baca SMS, lalu sadar itu penipuan. Di HP yang sama terbuka m-banking.',
                  choices: [
                    { id: 'c1', labelId: 'Segera telepon Call Center resmi bank untuk blokir sementara & pakai HP lain yang bersih untuk ganti sandi email/akun', feedbackId: 'Tepat! Memutus otoritas bank & mengganti kredensial di perangkat terpercaya menjaga pelaku tak terus mengintip sandi baru.', deltas: { scoreSecurity: 35, scoreRisk: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Ganti sandi lewat HP yang baru terkena .APK atau menunda blokir bank sampai besok', feedbackId: 'Mengganti sandi dari HP terkompromi berisiko terbaca pelaku melalui izin aksesibilitas/layar!', deltas: { cash: -1_500_000, scoreSecurity: -30 } },
                  ],
                },
                {
                  id: 'u15_b2',
                  periodLabelId: 'Menit ke-8: Menyelamatkan Bukti Sebelum Membersihkan HP',
                  narrativeId: 'Sebelum menghapus .APK atau melakukan reset pabrik HP kerabat, pesan chat, mutasi transfer Rp500rb yang keburu keluar, dan nomor rekening pelaku masih ada.',
                  choices: [
                    { id: 'c1', labelId: 'Amankan/screenshot semua bukti (chat, resi transfer, mutasi, detail .APK) LEBIH DULU, baru putuskan internet dan hapus/reset HP', feedbackId: 'Cermat! Bukti forensik utuh siap diajukan ke bank, iasc.ojk.go.id, & Polisi.', deltas: { scoreSecurity: 30, scoreGoal: 20 }, isRecommended: true },
                    { id: 'c2', labelId: 'Langsung factory reset tanpa menyimpan tangkapan layar mutasi dan chat pelaku', feedbackId: 'Seluruh bukti hilang sehingga menyulitkan proses laporan resmi!', deltas: { scoreGoal: -15 } },
                  ],
                },
                {
                  id: 'u15_b3',
                  periodLabelId: 'Menit ke-15+: Lapor Resmi vs Calo Refund',
                  narrativeId: 'Kamu melapor resmi ke iasc.ojk.go.id & Polisi. Tiba-tiba di media sosial ada akun bercentang palsu menawarkan "Percepat Refund 15 Menit asal transfer Rp300rb".',
                  choices: [
                    { id: 'c1', labelId: 'Tolak tegas Recovery Scam! Pahami IASC membantu pemblokiran/fund tracing tanpa jaminan kembali 100%, kawal lewat saluran resmi & Kepolisian', feedbackId: 'Bijak dan imun terhadap penipuan lapis kedua!', deltas: { scoreSecurity: 25, scoreGoal: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Transfer Rp300rb ke DM oknum demi janji refund instan', feedbackId: 'Terkena penipuan kedua (Recovery Scam)!', deltas: { cash: -300_000, scoreSecurity: -25 } },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Kecepatan blokir bank, rotasi sandi di perangkat bersih, penyimpanan bukti sebelum reset, dan penolakan Recovery Scam adalah standar tanggap darurat insiden keuangan digital.',
                assume: 'Judul "15 Menit Pertama" melatih kesigapan bertindak, bukan janji SLA pengembalian dana.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.IASC_OJK,
                next: 'Lanjutkan ke Unit 16 untuk membedakan LPBBTI legal OJK vs pinjol ilegal.',
              }),
            }),
          ],
        },
      ],
    },

    // ================= UNIT 16 =================
    {
      id: 'S3.U16',
      unitNumber: 16,
      semesterId: 'S3',
      titleId: 'Pinjaman Online Resmi OJK vs Ilegal',
      titleEn: 'Licensed P2P Lending (LPBBTI) vs Illegal Loans',
      regulationMeta: REG_SOURCES.LPBBTI_OJK,
      guidebook: {
        summaryId:
          'Gunakan sebutan resmi OJK: LPBBTI (Layanan Pendanaan Bersama Berbasis Teknologi Informasi / Pindar berizin OJK) dengan prinsip 2L (Legal: berizin OJK; Logis: syarat & bunga masuk akal). Sesuai POJK 40/2024 jo. SEOJK 19/SEOJK.06/2025, aplikasi LPBBTI hanya boleh mengakses CAMILAN (Camera, Microphone, Location), DILARANG mengakses Daftar Kontak, Galeri, SMS, atau Log Panggilan; dan Kontak Darurat HANYA boleh dipakai mengonfirmasi keberadaan peminjam setelah izin pemilik nomor, DILARANG menagih ke Kontak Darurat!',
        summaryEn: '2L principle, SEOJK 19/2025 CAMILAN permission limits, emergency contact rules, and Satgas PASTI / Kontak OJK 157 reporting.',
        keyRulesId: [
          'Aplikasi LPBBTI berizin hanya boleh meminta izin CAMILAN (Camera, Microphone, Location).',
          'Per SEOJK 19/2025: nomor Kontak Darurat wajib konfirmasi & persetujuan pemilik, dan HANYA untuk konfirmasi keberadaan, DILARANG menagih/mengancam kontak darurat.',
          'Jika diteror pinjol ilegal: jangan gali lubang ke pinjol lain, simpan bukti ancaman, lapor ke Satgas PASTI (sipasti.ojk.go.id), Kontak OJK 157 (WA 081 157 157 157), & Kepolisian.',
        ],
        keyRulesEn: [
          'Legal LPBBTI apps access only Camera, Microphone, Location (CAMILAN).',
          'Emergency contacts require direct consent and can NEVER be billed for debt collection.',
          'Report illegal threats to Satgas PASTI (sipasti.ojk.go.id), OJK 157, and Police.',
        ],
        disclaimerId:
          'Referensi Regulasi: POJK 40/2024 jo. SEOJK 19/SEOJK.06/2025 tentang LPBBTI & Satgas PASTI (ketentuan dinamis, verifikasi sebelum rilis konten).',
        disclaimerEn: 'Regulatory Reference: POJK 40/2024 & SEOJK 19/2025.',
      },
      stages: [
        {
          id: 'S3.U16.ST1',
          stageNumber: '16.1',
          titleId: 'Prinsip 2L, CAMILAN & Penanganan Ilegal',
          titleEn: '2L, CAMILAN & Illegal Debt Defense',
          skipExamId: 'SKIP.S3.U16.ST1',
          paths: [
            mkWordleLesson('S3.U16.ST1.P1', 'Kosakata Regulasi Pinjaman Daring', 'LPBBTI & OJK Terms', 'Menguasai istilah OJK, PASTI, CAMILAN, LEGAL.', [
              { word: 'OJK', clueId: 'Otoritas Jasa Keuangan pengawas resmi lembaga keuangan & LPBBTI legal di Indonesia.', clueEn: 'Indonesian Financial Services Authority.', definitionId: 'Lembaga independen pengatur dan pengawas perbankan, pasar modal, asuransi, & LPBBTI resmi.', definitionEn: 'Indonesia financial regulatory authority.', exampleId: 'Cek legalitas aplikasi pinjaman melalui Kontak OJK 157 atau WhatsApp 081 157 157 157.', exampleEn: 'Verify licensed Pindar status via OJK 157.' },
              { word: 'PASTI', clueId: 'Satgas pemberantas aktivitas keuangan ilegal (sipasti.ojk.go.id).', clueEn: 'Task force against illegal financial entities.', definitionId: 'Satuan Tugas Pemberantasan Aktivitas Keuangan Ilegal bentukan OJK dan instansi mitra.', definitionEn: 'Multi-agency illegal finance enforcement task force.', exampleId: 'Melaporkan aplikasi pinjol tak berizin dan investasi bodong ke portal sipasti.ojk.go.id.', exampleEn: 'Reporting illegal lenders to Satgas PASTI.' },
              { word: 'CAMILAN', clueId: 'Batas 3 izin akses perangkat resmi LPBBTI OJK: Camera, Microphone, Location.', clueEn: '3 permitted LPBBTI device permissions (Cam, Mic, Location).', definitionId: 'Batasan akses izin aplikasi LPBBTI berizin (hanya Kamera, Mikrofon, & Lokasi, dilarang kontak/galeri).', definitionEn: 'Strict Camera/Microphone/Location permission cap.', exampleId: 'Segera tolak jika ada aplikasi pinjaman meminta izin membaca seluruh Kontak dan Galeri Foto.', exampleEn: 'Reject any loan app demanding Contacts or Photo Gallery.' },
              { word: 'LEGAL', clueId: 'Huruf L pertama prinsip 2L: memiliki izin resmi terdaftar dari otoritas berwenang.', clueEn: 'Officially licensed by regulators (First L of 2L).', definitionId: 'Memenuhi syarat perizinan resmi OJK/BI serta mematuhi aturan perlindungan konsumen.', definitionEn: 'Operating with verified statutory licenses.', exampleId: 'Gunakan prinsip 2L (Legal dan Logis) sebelum bertransaksi dengan platform keuangan apa pun.', exampleEn: 'Apply 2L (Legal & Logical) checks before borrowing.' },
            ]),
            mkQuizLesson('S3.U16.ST1.P2', 'Aturan Izin Aplikasi, Kontak Darurat & Aduan OJK', 'CAMILAN & Emergency Contact Rights', 'Menguji izin akses LPBBTI, larangan menagih kontak darurat, & kanal resmi OJK.', [
              {
                id: 's3u16s1p2_q1',
                promptId: 'Sebuah aplikasi pinjaman meminta izin "Akses Seluruh Kontak Telepon, Galeri Foto & Log Panggilan" sebelum proses pengajuan. Bagaimana status aplikasi ini menurut aturan LPBBTI OJK?',
                promptEn: 'A loan app asks Contacts, Photo Gallery & Call Logs permission. Status under OJK LPBBTI rules?',
                optionsId: [
                  'Melanggar aturan CAMILAN sehingga mengindikasikan kuat pinjaman ilegal',
                  'Prosedur verifikasi skor kredit wajar yang dipakai seluruh fintech OJK',
                  'Diizinkan penuh asalkan peminjam menekan tombol persetujuan di aplikasi',
                  'Hanya berlaku untuk peminjam perdana agar pencairan awal lebih cepat',
                ],
                optionsEn: [
                  'Violates CAMILAN rule: strong illegal lender red flag; cancel immediately',
                  'Standard credit-scoring verification required across all licensed lenders',
                  'Fully permitted as long as borrowers tap Agree inside the onboarding screen',
                  'Applies solely on first-time borrowings to accelerate initial disbursement',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'LPBBTI resmi OJK hanya diizinkan mengakses CAMILAN (Kamera, Mikrofon, Lokasi) untuk verifikasi identitas (KYC) dan pencegahan fraud, tidak boleh menyedot Kontak maupun Galeri!',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.LPBBTI_OJK,
                  next: 'Periksa selalu menu perizinan aplikasi HP (App Permissions) sebelum melanjutkan pendaftaran apa pun.',
                }),
              },
              {
                id: 's3u16s1p2_q2',
                promptId: 'Berdasarkan SEOJK No. 19/SEOJK.06/2025 pada LPBBTI resmi, bagaimana aturan yang benar terkait penggunaan nomor Kontak Darurat?',
                promptEn: 'Under SEOJK 19/2025 for LPBBTI, how may Emergency Contacts be used?',
                optionsId: [
                  'Harus izin pemilik nomor & hanya untuk konfirmasi, dilarang keras ditagih',
                  'Otomatis menjadi penjamin utang sehingga wajib bayar saat debitur menunggak',
                  'Boleh diambil diam-diam dari daftar kontak HP tanpa konfirmasi pemiliknya',
                  'Penyelenggara boleh menagih kontak darurat jika telat melewati 7 hari kerja',
                ],
                optionsEn: [
                  'Requires owner consent & strictly confirms whereabouts, NEVER debt collection',
                  'Automatically acts as legal co-signer liable to repay overdue loans',
                  'May silently scrape contacts from phonebooks without prior verification',
                  'Debt collection calls to emergency contacts become valid after 7 days overdue',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'SEOJK 19/2025 menegaskan pemilik nomor Kontak Darurat tidak memiliki kewajiban hukum membayar utang peminjam dan tidak boleh menjadi sasaran penagihan!',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.LPBBTI_OJK,
                  next: 'Laporkan pelanggaran penagihan kepada Kontak OJK 157 (WA 081 157 157 157) atau sipasti.ojk.go.id.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.LPBBTI_OJK }),
            mkDetektifLesson('S3.U16.ST1.P3', 'Audit SMS/Chat Penawaran Pinjaman 2L', '2L Loan Offer Audit', 'Mengaudit tawaran pinjol ilegal vs LPBBTI berizin.', [
              {
                id: 'u16_dc1',
                channel: 'SMS',
                senderTitle: 'SMS Nomor Pribadi: "Selamat! Dana Rp5jt Cair Instan Tanpa KTP! Klik link APK"',
                documentLines: [
                  '• Pengirim dari nomor +62857xxxx dengan link unduh di luar Play Store / App Store resmi',
                  '• Tidak tercantum nama perusahaan PT resmi berizin OJK maupun transparansi bunga/tenor',
                ],
                questionId: 'Bagaimana penilaian 2L (Legal & Logis) atas penawaran ini?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA (TIDAK LEGAL & TIDAK LOGIS): Pinjaman berizin OJK dilarang menawarkan via SMS/WA pribadi tanpa izin atau lewat tautan APK', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Langsung klik karena sedang butuh dana cepat tanpa verifikasi', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'WASPADA: Boleh pinjam sedikit Rp500rb saja untuk coba', verdict: 'WASPADA' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'LPBBTI/Pindar berizin OJK dilarang melakukan pemasaran lewat pesan pribadi tanpa persetujuan konsumen dan tidak menyalurkan aplikasi lewat link .apk sembarangan.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.LPBBTI_OJK,
                  next: 'Cek daftar penyelenggara LPBBTI resmi terbaru melalui Kontak OJK 157 sebelum meminjam.',
                }),
              },
              {
                id: 'u16_dc2',
                channel: 'Tawaran',
                senderTitle: 'Aplikasi LPBBTI Terdaftar OJK: Rincian Pokok, Tenor, Manfaat Ekonomi & Izin CAMILAN',
                documentLines: [
                  '• Nama PT terdaftar resmi terkonfirmasi lewat Kontak OJK 157',
                  '• Rincian biaya harian/bulanan (mematuhi batas manfaat ekonomi OJK) & total kembali tercantum transparan sebelum setuju',
                  '• Hanya meminta izin Kamera, Mikrofon, & Lokasi (CAMILAN)',
                ],
                questionId: 'Apakah aplikasi ini memenuhi prinsip dasar 2L sebelum pengambilan keputusan?',
                optionsId: [
                  { id: 'o1', labelId: 'AMAN SECARA LEGALITAS: Tetap hitung dulu apakah cicilan sesuai kemampuan bayar sebelum menandatangani kontrak', verdict: 'AMAN' },
                  { id: 'o2', labelId: 'BAHAYA: Semua LPBBTI berizin OJK itu ilegal', verdict: 'BAHAYA' },
                  { id: 'o3', labelId: 'AMAN: Boleh pinjam maksimal tanpa menghitung kemampuan bayar karena legal', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'fakta_terobservasi',
                explanationCard: card({
                  why: 'Prinsip 2L mengharuskan keduanya terpenuhi: Legal (izin resmi OJK, CAMILAN) DAN Logis (bunga serta cicilan benar-benar masuk akal bagi arus kasmu).',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.LPBBTI_OJK,
                  next: 'Legal bukan berarti wajib berutang, pinjam hanya untuk kebutuhan terukur dan mampu bayar.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.LPBBTI_OJK }),
            mkPairLesson('S3.U16.ST1.P4', 'Urutan Penanganan Teror Pinjol Ilegal', 'Handling Illegal Collection Threats', 'Menghadapi teror ilegal secara tepat tanpa gali lubang baru.', {
              mode: 'sequence',
              instructionId: 'Urutkan 4 langkah menghadapi teror penagihan pinjaman ilegal agar masalah tidak makin membesar.',
              instructionEn: 'Order the 4 steps when facing illegal loan collection harassment.',
              sequenceSteps: [
                { id: 'il1', labelId: 'Berhenti meminjam di pinjol ilegal lain untuk gali lubang tutup lubang', labelEn: 'Stop borrowing from other illegal lenders', order: 1 },
                { id: 'il2', labelId: 'Dokumentasikan seluruh bukti ancaman, nomor pengirim, rekaman chat, & tangkapan layar aplikasi', labelEn: 'Archive all threat evidence & caller IDs', order: 2 },
                { id: 'il3', labelId: 'Cabut izin aplikasi di pengaturan HP & beri tahu singkat orang terdekat jika data terlanjur tersebar', labelEn: 'Revoke app permissions & warn close contacts briefly if leaked', order: 3 },
                { id: 'il4', labelId: 'Laporkan ke Satgas PASTI (sipasti.ojk.go.id), Kontak OJK 157 (WA 081 157 157 157), & Kepolisian', labelEn: 'Report to Satgas PASTI, OJK 157 & Police', order: 4 },
              ],
              explanationCard: card({
                why: 'Menutup satu pinjol ilegal dengan pinjol ilegal baru hanya melipatgandakan bunga harian dan jumlah penagih ilegal.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.LPBBTI_OJK,
                next: 'Lindungi mental dan fokus selesaikan kewajiban resmi sambil menyerahkan pelaporan ancaman ke pihak berwenang.',
              }),
            }, { st: 'dynamic_fact', reg: REG_SOURCES.LPBBTI_OJK }),
            mkStoryLesson('S3.U16.ST1.P5', 'Darurat Biaya Tengah Bulan', 'Mid-Month Emergency Solvency', 'Memilih jalan keluar darurat legal tanpa terseret pinjol ilegal.', {
              titleId: 'Darurat Biaya Mendadak di Tengah Bulan',
              subtitleId: 'Simulasi Memilih Solusi Legal & Bebas Pinjol Ilegal',
              durationLabelId: '3 Babak Simulasi',
              initialState: { cash: 400_000, emergencyFund: 1_200_000, sinkingFund: 0, debt: 500_000, netWorth: 1_100_000 },
              chapters: [
                {
                  id: 'u16_b1',
                  periodLabelId: 'Babak 1: Kebutuhan Mendesak Rp1.000.000',
                  narrativeId: 'Ban motormu pecah + harus perpanjang dokumen mendadak senilai Rp1.000.000 di tanggal tua. Di HP muncul SMS iklan "Pinjol Cair 5 Menit Tanpa KTP" yang meminta izin seluruh kontak HP.',
                  choices: [
                    { id: 'c1', labelId: 'Gunakan Dana Darurat Rp1.000.000 yang memang disediakan untuk hal mendadak & abaikan SMS ilegal', feedbackId: 'Inilah fungsi asli Dana Darurat, menyelamatkanmu dari jerat bunga harian ilegal!', deltas: { emergencyFund: -1_000_000, scoreRisk: 30, scoreSecurity: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Unduh APK SMS pinjol cepat cair karena sayang membongkar Dana Darurat', feedbackId: 'Salah total! Dana Darurat justru dibuat untuk kondisi mendesak seperti ini, sedangkan APK ilegal menyedot daftar kontak!', deltas: { debt: 1_500_000, scoreSecurity: -35 }, illegalDebtFlag: true },
                  ],
                },
                {
                  id: 'u16_b2',
                  periodLabelId: 'Babak 2: Teman Mengabarkan Namanya Diteror Penagih',
                  narrativeId: 'Rekanmu cerita ia dicantumkan tanpa izin sebagai Kontak Darurat di sebuah aplikasi dan langsung diancam harus membayar utang si peminjam.',
                  choices: [
                    { id: 'c1', labelId: 'Sarankan untuk tidak membayar sepeser pun (sesuai SEOJK 19/2025 bukan tanggung jawabnya), simpan bukti ancaman, & lapor ke Kontak OJK 157 / Satgas PASTI', feedbackId: 'Akurat sesuai regulasi perlindungan konsumen LPBBTI terbaru!', deltas: { scoreSecurity: 30, scoreGoal: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Suruh ia melunasi utang orang lain tersebut karena namanya sudah tertulis sebagai kontak darurat', feedbackId: 'Keliru! Kontak Darurat tidak berkewajiban menanggung utang siapa pun.', deltas: { scoreSecurity: -20 } },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Kombinasi Dana Darurat, prinsip 2L, pemahaman CAMILAN, dan kesadaran hak Kontak Darurat per SEOJK 19/2025 membentengi keluarga dari jerat pinjol ilegal.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.LPBBTI_OJK,
                next: 'Uji seluruh kemampuan utang & keamanan siber di Gerbang UAS Semester 3!',
              }),
            }),
          ],
        },
      ],
    },
  ],
  uts: buildUTS('S3', 'UTS Semester 3: Bunga, SLIK OJK & Benteng Data', 'Unit 12–14', ['S3.U12', 'S3.U13', 'S3.U14']),
  uas: buildUAS(
    'S3',
    'UAS Semester 3: Manajemen Utang & Pemulihan Siber',
    'Unit 12–16',
    ['S3.U12', 'S3.U13', 'S3.U14', 'S3.U15', 'S3.U16'],
    'Proyek Debt Triage & Cyber Recovery 6 Bulan',
    6,
    {
      isPerformanceProject: true,
      titleId: 'Proyek UAS S3: Debt Triage & Cyber Recovery 6 Bulan',
      subtitleId: 'Bagian 2 Proyek Kinerja · Bobot 50%: Uji Avalanche, SLIK Kol 1 & Respons Phishing',
      durationLabelId: '6 Bulan Virtual',
      initialState: { cash: 1_500_000, emergencyFund: 1_000_000, sinkingFund: 0, debt: 6_000_000, netWorth: -3_500_000 },
      chapters: [
        {
          id: 's3_uas_1',
          periodLabelId: 'Bulan 1–2: Insiden Phishing Link & Triage 2 Utang',
          narrativeId: 'Kamu punya Utang A (3%/bln) & B (1,5%/bln). Di Bulan 2, klik tautan tarif palsu sempat terjadi di HP lama.',
          choices: [
            { id: 'c1', labelId: 'Blokir bank segera, ganti sandi via perangkat bersih lain, simpan bukti sebelum reset, lapor IASC/Polisi tanpa tertipu Recovery Scam', feedbackId: 'Kerusakan terhenti cepat dan bukti pelaporan terjaga utuh!', deltas: { scoreSecurity: 35, scoreRisk: 20 }, isRecommended: true },
            { id: 'c2', labelId: 'Reset HP sebelum bukti disimpan lalu bayar jasa hacker IG untuk mengembalikan dana', feedbackId: 'Kehilangan bukti laporan dan terkena jebakan Recovery Scam!', deltas: { cash: -600_000, scoreSecurity: -35 } },
          ],
        },
        {
          id: 's3_uas_2',
          periodLabelId: 'Bulan 3–6: Pelunasan Avalanche & Menolak Pinjol Ilegal',
          narrativeId: 'Saat merapikan arus kas sisa bulan ke-3 hingga ke-6 dengan metode Avalanche, muncul iklan pinjol ilegal menawarkan dana cepat tanpa verifikasi.',
          choices: [
            { id: 'c1', labelId: 'Tolak tegas pinjol ilegal, prioritaskan pelunasan ekstra Utang A (bunga tertinggi 3%/bln), & jaga Kol 1 SLIK OJK tetap bersih', feedbackId: 'DSR turun di bawah 25% di Bulan ke-6, SLIK terjaga Kol 1, dan bebas jerat ilegal!', deltas: { debt: -3_500_000, netWorth: 3_500_000, scoreCashflow: 30, scoreGoal: 30 }, isRecommended: true },
            { id: 'c2', labelId: 'Ambil pinjol ilegal berbunga harian untuk melunasi Utang A lebih cepat', feedbackId: 'Gagal Kritis: utang ilegal masuk dalam portofolio.', deltas: { debt: 2_000_000, scoreSecurity: -40 }, illegalDebtFlag: true },
          ],
        },
      ],
      explanationCard: card({
        why: 'Penanganan insiden siber yang urut digabungkan dengan strategi Avalanche terukur memulihkan kesehatan kredit tanpa utang ilegal.',
        type: 'dynamic_fact',
        reg: REG_SOURCES.IASC_OJK,
        next: 'Semester 4 siap memandu strategi Dana Darurat, Proteksi BPJS/Asuransi, Inflasi, & Bunga Majemuk!',
      }),
    }
  ),
};
