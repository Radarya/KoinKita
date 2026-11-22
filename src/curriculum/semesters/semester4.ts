import { SemesterSpec } from '../types';
import {
  REG_SOURCES,
  buildUAS,
  buildUTS,
  card,
  mkDetektifLesson,
  mkPairLesson,
  mkPohonLesson,
  mkQuizLesson,
  mkStoryLesson,
  mkWordleLesson,
} from '../helpers';

export const SEMESTER_4: SemesterSpec = {
  id: 'S4',
  semesterNumber: 4,
  titleId: 'Semester 4: Ketahanan Krisis, Polis Asuransi & Nilai Waktu Uang',
  titleEn: 'Semester 4: Crisis Resilience, Insurance Policies & Time Value of Money',
  subtitleId: 'Dana Darurat tanpa salah wadah, bedah klaim polis asuransi, rumus riil Fisher, & kekuatan waktu.',
  units: [
    // ================= UNIT 17 =================
    {
      id: 'S4.U17',
      unitNumber: 17,
      semesterId: 'S4',
      titleId: 'Membangun & Menyimpan Dana Darurat',
      titleEn: 'Building & Storing Emergency Funds',
      guidebook: {
        summaryId:
          'Dana Darurat adalah bantalan likuid sebelum mulai berinvestasi di aset berfluktuasi tinggi. Pedoman umum yang disesuaikan stabilitas kerja: lajang 3–6x pengeluaran bulanan wajib, sedangkan berkeluarga/berpenghasilan fluktuatif 6–12x pengeluaran bulanan. Tempat menyimpannya wajib aman, terpisah dari rekening belanja harian, dan mudah dicairkan, dengan catatan pencairan Reksadana Pasar Uang mengikuti prospektus, cut-off, hari kerja, & bank prosesor (bukan instan 24/7).',
        summaryEn: '3–6x vs 6–12x emergency reserve rules of thumb and liquid storage selection.',
        keyRulesId: [
          'Ukur target Dana Darurat dari PENGELUARAN BULANAN WAJIB (bukan gaya hidup mewah atau total gaji).',
          'Sisakan porsi darurat sangat mendesak di tabungan terpisah 24/7; jangan taruh Dana Darurat di saham volatil atau properti tak likuid.',
          'Reksadana Pasar Uang likuiditasnya bertahap sesuai prospektus, jam cut-off, hari kerja, & bank prosesor.',
        ],
        keyRulesEn: [
          'Measure target based on essential monthly expenses.',
          'Keep immediate cash separate 24/7; avoid volatile stocks or illiquid property.',
          'RDPU redemption follows product prospectus, cut-off time & business days.',
        ],
        disclaimerId:
          'Pedoman umum (3–6x / 6–12x) bersifat fleksibel menyesuaikan stabilitas pekerjaan, asuransi keluarga, dan tanggungan masing-masing.',
        disclaimerEn: 'Rule-of-thumb multipliers adapt to individual household risk.',
      },
      stages: [
        {
          id: 'S4.U17.ST1',
          stageNumber: '17.1',
          titleId: 'Target & Tempat Simpan Dana Darurat',
          titleEn: 'Targets & Storage Containers',
          skipExamId: 'SKIP.S4.U17.ST1',
          paths: [
            mkWordleLesson('S4.U17.ST1.P1', 'Kosakata Ketahanan Krisis', 'Crisis Reserve Vocabulary', 'Menguasai istilah darurat, likuid, cadang, dan krisis.', [
              { word: 'DARURAT', clueId: 'Bantalan uang khusus kejadian tak terduga seperti sakit IGD atau kehilangan kerja.', clueEn: 'Dedicated reserve for unforeseen crises.', definitionId: 'Dana cadangan aman dan terpisah untuk menghadapi musibah mendadak tanpa harus berutang mahal.', definitionEn: 'Dedicated crisis liquidity cushion.', exampleId: 'Menyiapkan Dana Darurat 3–6x pengeluaran wajib sebelum membeli instrumen berisiko tinggi.', exampleEn: 'Building 3–6x essential expenses reserve first.' },
              { word: 'LIKUID', clueId: 'Kemampuan aset segera dicairkan menjadi uang tunai cepat tanpa banting harga besar.', clueEn: 'Speed and ease of converting to cash cleanly.', definitionId: 'Tingkat kecepatan pencairan aset menjadi kas siap pakai tanpa kehilangan nilai signifikan.', definitionEn: 'Ability to convert asset into cash rapidly without steep loss.', exampleId: 'Tabungan rekening terpisah jauh lebih likuid daripada tanah/properti.', exampleEn: 'A separate savings account is far more liquid than real estate.' },
              { word: 'CADANG', clueId: 'Porsi dana yang sengaja disimpan terpisah sebagai pengaman arus kas.', clueEn: 'Set-aside reserve allocation.', definitionId: 'Simpanan penyangga agar gangguan pendapatan sementara tidak menghentikan kebutuhan hidup pokok.', definitionEn: 'Buffer fund stabilizing temporary shocks.', exampleId: 'Freelancer menyimpan dana cadang bulan ramai untuk menutup bulan sepi order.', exampleEn: 'Buffer reserve covers low-order months.' },
              { word: 'KRISIS', clueId: 'Guncangan mendadak seperti PHK, kerusakan alat kerja vital, atau musibah keluarga.', clueEn: 'Sudden financial shock event.', definitionId: 'Situasi mendesak di luar rencana rutin yang memerlukan kesiapan dana likuid segera.', definitionEn: 'Unplanned urgent financial event.', exampleId: 'Dana darurat membuat keluarga bertahan tenang saat krisis PHK tanpa menyentuh pinjol ilegal.', exampleEn: 'Emergency funds help survive layoffs without illegal loans.' },
            ]),
            mkQuizLesson('S4.U17.ST1.P2', 'Hitung Target Dana Darurat Lajang vs Keluarga', 'Calculate Emergency Fund Targets', 'Menghitung pedoman target sesuai tanggungan dan menimbang pengeluaran wajib.', [
              {
                id: 's4u17s1p2_q1',
                promptId: 'Pekerja lajang berpenghasilan tetap memiliki pengeluaran bulanan wajib (kos, makan pokok, listrik, transport) Rp3.500.000. Berapa pedoman target Dana Darurat awalnya (3–6x)?',
                promptEn: 'Single worker with Rp3.5M essential monthly spend. 3–6x Emergency Fund range?',
                optionsId: [
                  'Rp10.500.000 hingga Rp21.000.000',
                  'Rp3.500.000 hingga Rp7.000.000',
                  'Rp31.500.000 hingga Rp42.000.000',
                  'Rp1.750.000 hingga Rp3.500.000',
                ],
                optionsEn: [
                  'Rp10,500,000 – Rp21,000,000',
                  'Rp3,500,000 – Rp7,000,000',
                  'Rp31,500,000 – Rp42,000,000',
                  'Rp1,750,000 – Rp3,500,000',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Pedoman umum pekerja lajang berpendapatan stabil berada pada kisaran 3–6 kali pengeluaran wajib bulanan.',
                  calc: '3 × Rp3.500.000 = Rp10.500.000; 6 × Rp3.500.000 = Rp21.000.000.',
                  next: 'Bangun bertahap dari 1 bulan pengeluaran dulu, lalu 3 bulan, hingga mencapai target penuh.',
                }),
              },
              {
                id: 's4u17s1p2_q2',
                promptId: 'Keluarga dengan 2 anak berpenghasilan usaha naik-turun mencatat pengeluaran wajib Rp7.000.000/bln (pedoman 9–12x). Berapakah target idealnya dan mengapa diukur dari PENGELUARAN WAJIB?',
                promptEn: 'Family of 4 with irregular business income spending Rp7M/mo (9–12x rule of thumb). Target?',
                optionsId: [
                  'Rp63jt–Rp84jt; saat krisis cukup menutup biaya hidup esensial saja',
                  'Rp21jt–Rp42jt; standar pekerja tetap berlaku 3–6x biaya pokok semua profil',
                  'Rp84jt–Rp100jt; patokan dihitung dari total belanja gaya hidup bulanan penuh',
                  'Rp7jt–Rp14jt; karena tabungan darurat cukup membiayai makan pokok 1 bulan',
                ],
                optionsEn: [
                  'Rp63M – Rp84M; crisis survival only needs core essential costs',
                  'Rp21M – Rp42M; the 3-6x fixed-earner rule covers every family profile',
                  'Rp84M – Rp100M; measured using total luxury and lifestyle spending levels',
                  'Rp7M – Rp14M; emergency buffers only cover one single month of groceries',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Saat krisis PHK atau omzet jatuh, keluarga memangkas belanja gaya hidup tetapi wajib terus membiayai makan pokok, rumah, sekolah, & tagihan utilitas.',
                  calc: '9 × Rp7jt = Rp63jt; 12 × Rp7jt = Rp84jt.',
                  assume: 'Angka 3–6x / 9–12x merupakan pedoman umum fleksibel.',
                  next: 'Tentukan nominal target Dana Darurat keluargamu sendiri hari ini.',
                }),
              },
            ]),
            mkPairLesson('S4.U17.ST1.P3', 'Kesesuaian Wadah Simpan Dana Darurat', 'Storage Container Suitability', 'Menilai likuiditas wadah simpan tanpa klaim T+1..2 mutlak pada RDPU.', {
              mode: 'pairs',
              instructionId: 'Pasangkan instrumen penyimpanan berikut dengan kecocokan riilnya sebagai wadah Dana Darurat.',
              instructionEn: 'Match each storage vehicle with its true suitability for Emergency Funds.',
              pairs: [
                { id: 'dd1', leftId: 'Rekening Tabungan Terpisah (Tanpa Kartu Belanja Harian)', leftEn: 'Separate Savings Account', rightId: 'Akses cair cepat 24/7 untuk porsi darurat mendesak hari ini juga', rightEn: '24/7 immediate cash access' },
                { id: 'dd2', leftId: 'Reksadana Pasar Uang (Sebagian Lapisan Kedua)', leftEn: 'Money Market Mutual Fund (Layer 2)', rightId: 'Relatif rendah fluktuasinya; waktu cair bergantung prospektus, cut-off, hari kerja, & bank prosesor (tetap perlu kas cair 24/7!)', rightEn: 'Relatively low volatility; redemption timing depends on prospectus, cutoff & business days' },
                { id: 'dd3', leftId: 'Saham Volatil / Aset Kripto', leftEn: 'Volatile Stocks / Crypto', rightId: 'Tidak cocok: harga bisa merosot 30–50% tepat ketika krisis PHK datang!', rightEn: 'Unsuitable due to sharp crash risk during crises' },
                { id: 'dd4', leftId: 'Tanah / Rumah Properti', leftEn: 'Land / Real Estate', rightId: 'Tidak likuid: penjualan memakan berbulan-bulan atau terpaksa banting harga', rightEn: 'Illiquid for urgent cash needs' },
              ],
              explanationCard: card({
                why: 'Reksadana Pasar Uang berguna untuk lapisan bertingkat, tetapi tidak pernah menggantikan kas rekening terpisah 100% karena proses pencairan bursa/bank terikat jam cut-off dan hari kerja.',
                next: 'Bagi Dana Darurat dalam 2 lapis: kas instan di rekening terpisah + lapisan lanjutan berisiko rendah.',
              }),
            }),
            mkPohonLesson('S4.U17.ST1.P4', 'Pohon Aset Mode Ketahanan Krisis', 'Resilience Simulation', 'Mengelola likuiditas menghadapi 2 guncangan krisis sambil menghindari aset tak likuid/berisiko saat butuh dana.', {
              mode: 'ketahanan',
              scenarioTitleId: 'Uji Ketahanan Dana Darurat Saat Krisis Ganda',
              scenarioIntroId:
                'Kamu punya kas awal Rp12 juta untuk keluarga berpengeluaran wajib Rp4 juta/bln. Di Kuartal 2 muncul atap bocor mendadak (Rp4jt) dan Kuartal 3 terjadi pengurangan jam kerja!',
              horizonLabelId: '4 Kuartal (1 Tahun Krisis)',
              initialCash: 6_000_000,
              initialInvested: 6_000_000,
              targetGoalAmount: 14_000_000,
              quarters: [
                {
                  quarterLabelId: 'Kuartal 1: Menata Wadah Sebelum Krisis',
                  eventTitleId: 'Menentukan Penempatan Rp12 Juta Awal',
                  eventDescId: 'Kamu belum memiliki cadangan darurat terpisah. Tawaran menggiurkan menyuruh menaruh seluruh Rp12jt ke saham gorengan atau DP tanah tak likuid.',
                  macroWeather: 'NORMAL',
                  options: [
                    {
                      id: 'q1_opt1',
                      labelId: 'Amankan Rp8jt di Rekening Tabungan Terpisah (cair 24/7) + Rp4jt di aset bertahap likuid/stabil',
                      descId: 'Menyeimbangkan akses instan 24/7 sambil tetap menjaga efisiensi biaya admin.',
                      cashDelta: 2_000_000,
                      investedDelta: -2_000_000,
                      riskExposureScore: 10,
                      inflationProtectionScore: 40,
                      liquidityScore: 90,
                      feedbackId: 'Cerdas! Bantalan darurat likuid siap sedia sebelum badai datang.',
                      isOptimal: true,
                    },
                    {
                      id: 'q1_opt2',
                      labelId: 'Kunci seluruh Rp12jt ke instrumen saham agresif / tanah tak likuid demi kejar untung cepat',
                      descId: 'Saldo tunai Rp0 bila tiba-tiba butuh biaya IGD atau perbaikan malam ini.',
                      cashDelta: -6_000_000,
                      investedDelta: 6_000_000,
                      riskExposureScore: 95,
                      inflationProtectionScore: 70,
                      liquidityScore: 10,
                      feedbackId: 'Bahaya likuiditas! Kas tunai habis sehingga krisis nanti memaksamu jual rugi atau berutang.',
                    },
                  ],
                },
                {
                  quarterLabelId: 'Kuartal 2: Badai & Atap Rumah Bocor (Butuh Rp4 Juta Hari Ini)',
                  eventTitleId: 'Musibah Tak Terduga di Malam Hari',
                  eventDescId: 'Pasar saham sedang turun -25% tepat saat genteng rumah jebol dan butuh tukang secepatnya.',
                  macroWeather: 'KRISIS',
                  options: [
                    {
                      id: 'q2_opt1',
                      labelId: 'Gunakan kas Dana Darurat likuid Rp4 juta tanpa menyentuh aset lain yang sedang koreksi',
                      descId: 'Tagihan perbaikan lunas hari itu juga tanpa jual rugi maupun pinjol.',
                      cashDelta: -4_000_000,
                      investedDelta: 0,
                      riskExposureScore: 10,
                      inflationProtectionScore: 40,
                      liquidityScore: 85,
                      feedbackId: 'Tepat! Inilah mengapa likuiditas Dana Darurat menyelamatkan stabilitas keluarga.',
                      isOptimal: true,
                    },
                    {
                      id: 'q2_opt2',
                      labelId: 'Terpaksa jual aset saham saat anjlok -25% atau pinjam kredit berbunga tinggi',
                      descId: 'Mengunci kerugian permanen sebesar -25% karena tak ada kas likuid.',
                      cashDelta: -5_000_000,
                      investedDelta: -1_000_000,
                      riskExposureScore: 80,
                      inflationProtectionScore: 20,
                      liquidityScore: 15,
                      feedbackId: 'Kerugian ganda: pasar turun mengunci rugi dan biaya darurat tetap keluar.',
                    },
                  ],
                },
                {
                  quarterLabelId: 'Kuartal 3–4: Pemulihan Bertahap Pasca Pengurangan Lembur',
                  eventTitleId: 'Mengisi Ulang Cadangan & Surplus Jangka Panjang',
                  eventDescId: 'Jam kerja kembali normal di Kuartal 4 dan ada surplus gaji baru Rp6 juta.',
                  macroWeather: 'BOOM',
                  options: [
                    {
                      id: 'q3_opt1',
                      labelId: 'Isi ulang Dana Darurat ke posisi aman lalu alokasikan sisa surplus ke aset bertumbuh terukur',
                      descId: 'Seimbang antara bantalan risiko dan pertumbuhan nilai jangka panjang.',
                      cashDelta: 4_000_000,
                      investedDelta: 2_000_000,
                      riskExposureScore: 30,
                      inflationProtectionScore: 70,
                      liquidityScore: 85,
                      feedbackId: 'Sempurna! Kas aman penuh dan aset bertumbuh kembali bekerja.',
                      isOptimal: true,
                    },
                    {
                      id: 'q3_opt2',
                      labelId: 'Habiskan seluruh Rp6 juta bonus pemulihan untuk belanja konsumtif tanpa isi ulang Dana Darurat',
                      descId: 'Cadangan tetap tipis jika tahun depan terjadi guncangan baru.',
                      cashDelta: -500_000,
                      investedDelta: 0,
                      riskExposureScore: 50,
                      inflationProtectionScore: 10,
                      liquidityScore: 30,
                      feedbackId: 'Berisiko! Dana darurat yang tak diisi ulang kembali rapuh.',
                    },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Dana Darurat di wadah likuid mencegah terpaksa menjual aset investasi saat pasar jatuh atau terjerat utang bunga tinggi saat krisis datang bersamaan.',
                type: 'simulation_assumption',
                next: 'Lanjutkan ke Unit 18 untuk melapisi Dana Darurat dengan perlindungan risiko asuransi murni & BPJS!',
              }),
            }),
          ],
        },
      ],
    },

    // ================= UNIT 18 =================
    {
      id: 'S4.U18',
      unitNumber: 18,
      semesterId: 'S4',
      titleId: 'BPJS, Asuransi Murni & Membaca Polis Klaim',
      titleEn: 'BPJS, Pure Insurance & Reading Policy Claims',
      regulationMeta: REG_SOURCES.ASURANSI_BPJS,
      guidebook: {
        summaryId:
          'Asuransi adalah mekanisme pengalihan risiko bencana finansial, bukan instrumen mencari untung cepat. Kenali BPJS Kesehatan (JKN) serta program terpisah BPJS Ketenagakerjaan (JKK kecelakaan kerja, JKM kematian bukan akibat kecelakaan kerja, JHT hari tua, JP pensiun, JKP kehilangan kerja). Pahami beda Asuransi Tradisional Murni vs Unit Link, serta pasal krusial polis: Masa Tunggu (Waiting Period), Pengecualian, Plafon/Inner Limit, Lapse, & deklarasi kondisi pre-existing.',
        summaryEn: 'BPJS Health/TK programs, Pure vs Unit-Link insurance, and reading waiting period, exclusions & inner limits.',
        keyRulesId: [
          'Asuransi Jiwa Berjangka memprioritaskan tanggungan pencari nafkah (bukan untuk pelajar lajang tanpa tanggungan).',
          'Kondisi pre-existing yang sengaja tak dideklarasikan BERISIKO DITOLAK / DIBATALKAN sesuai ketentuan polis (keputusan akhir merujuk klausul polis spesifik).',
          'Daftar dokumen klaim bervariasi antar perusahaan asuransi, jenis polis, & tipe klaim (cashless vs reimbursement).',
        ],
        keyRulesEn: [
          'Term Life protects dependents of primary breadwinners.',
          'Undeclared pre-existing conditions risk rejection or cancellation per policy terms.',
          'Claim document checklists vary by insurer, product & cashless/reimbursement type.',
        ],
        disclaimerId:
          'Referensi Regulasi: BPJS Kesehatan, BPJS TK, & ketentuan polis/Unit Link OJK; kutipan audit polis memakai parameter skenario edukasi eksplisit.',
        disclaimerEn: 'Regulatory Reference: BPJS & OJK insurance guidelines.',
      },
      stages: [
        {
          id: 'S4.U18.ST1',
          stageNumber: '18.1',
          titleId: 'Pengalih Risiko & Jaminan Sosial BPJS',
          titleEn: 'Risk Transfer & BPJS Social Security',
          skipExamId: 'SKIP.S4.U18.ST1',
          paths: [
            mkWordleLesson('S4.U18.ST1.P1', 'Kosakata Proteksi & Polis', 'Insurance Policy Vocabulary', 'Menguasai istilah premi, polis, klaim, & plafon.', [
              { word: 'PREMI', clueId: 'Iuran berkala yang dibayar peserta ke perusahaan asuransi untuk mempertahankan perlindungan.', clueEn: 'Periodic insurance payment.', definitionId: 'Sejumlah uang yang dibayarkan berkala sebagai imbalan pengalihan risiko kepada penanggung.', definitionEn: 'Recurring payment keeping insurance active.', exampleId: 'Menunggak premi lewat masa tenggang dapat membuat status polis menjadi lapse.', exampleEn: 'Missing premiums past grace period causes lapse.' },
              { word: 'POLIS', clueId: 'Kontrak hukum tertulis berisi hak, masa tunggu, plafon, dan pengecualian klaim.', clueEn: 'Written insurance contract document.', definitionId: 'Akta perjanjian resmi antara penanggung dan pemegang polis yang mengatur syarat tanggungan.', definitionEn: 'Legal contract defining covered risks and exclusions.', exampleId: 'Selalu baca bab masa tunggu dan pengecualian di buku polis dalam masa pelajari (free look).', exampleEn: 'Read policy exclusions during the free-look window.' },
              { word: 'KLAIM', clueId: 'Pengajuan resmi manfaat penggantian biaya atau santunan saat risiko terjadi.', clueEn: 'Formal benefit or reimbursement request.', definitionId: 'Permintaan resmi peserta kepada penanggung untuk membayarkan manfaat sesuai isi polis.', definitionEn: 'Formal request for covered payout.', exampleId: 'Menyiapkan resume medis dan kuitansi asli terinci untuk klaim reimbursement.', exampleEn: 'Submitting itemized receipts for reimbursement claims.' },
              { word: 'PLAFON', clueId: 'Batas maksimal nominal biaya kamar atau santunan yang ditanggung per hari/tahun.', clueEn: 'Maximum coverage limit cap.', definitionId: 'Batas nilai tertinggi penggantian asuransi; selisih di atas plafon menjadi tanggungan pasien.', definitionEn: 'Coverage ceiling beyond which excess applies.', exampleId: 'Jika kamar VIP melebihi batas plafon kamar harian polis, pasien membayar selisih excess claim.', exampleEn: 'Choosing rooms above daily inner limit triggers excess.' },
            ]),
            mkPairLesson('S4.U18.ST1.P2', 'Petakan Musibah ke Proteksi & Program BPJS TK Spesifik', 'Map Risks to Protection & BPJS TK', 'Memisahkan BPJS Kesehatan, Term Life, JKK, JKM, JHT, & Asuransi Umum secara akurat.', {
              mode: 'pairs',
              instructionId: 'Cocokkan risiko keuangan dengan instrumen proteksi atau program BPJS TK yang paling tepat.',
              instructionEn: 'Match each financial risk with the specific Indonesian protection layer.',
              pairs: [
                { id: 'bp1', leftId: 'Biaya rawat inap penyakit berat / operasi medis', leftEn: 'Hospital inpatient & surgery costs', rightId: 'BPJS Kesehatan (JKN) + Asuransi Kesehatan Murni sesuai kemampuan', rightEn: 'BPJS Health + Pure Health Insurance' },
                { id: 'bp2', leftId: 'Pencari nafkah keluarga meninggal saat anak masih sekolah', leftEn: 'Breadwinner passing while children depend', rightId: 'Asuransi Jiwa Berjangka (Term Life Murni)', rightEn: 'Pure Term Life Insurance' },
                { id: 'bp3', leftId: 'Kecelakaan kerja saat berangkat, bertugas, atau pulang kerja', leftEn: 'Accidents commuting or on the job', rightId: 'BPJS Ketenagakerjaan: JKK (Jaminan Kecelakaan Kerja)', rightEn: 'BPJS TK: JKK' },
                { id: 'bp4', leftId: 'Kematian bukan karena kecelakaan kerja & tabungan pensiun hari tua karyawan', leftEn: 'Non-work death protection & worker retirement fund', rightId: 'BPJS Ketenagakerjaan: JKM (Jaminan Kematian) & JHT (Hari Tua)', rightEn: 'BPJS TK: JKM & JHT' },
                { id: 'bp5', leftId: 'Kerusakan tabrakan kendaraan atau kebakaran aset usaha', leftEn: 'Vehicle accident or store fire damage', rightId: 'Asuransi Umum (Kendaraan / Properti)', rightEn: 'General Property / Auto Insurance' },
              ],
              explanationCard: card({
                why: 'BPJS Ketenagakerjaan memisahkan tegas JKK (kecelakaan kerja), JKM (kematian bukan akibat kecelakaan kerja), JHT (akumulasi hari tua), JP (pensiun berkala), dan JKP (PHK).',
                type: 'dynamic_fact',
                reg: REG_SOURCES.ASURANSI_BPJS,
                next: 'Pastikan seluruh anggota keluarga inti aktif di BPJS Kesehatan sebelum menambah polis swasta.',
              }),
            }, { st: 'dynamic_fact', reg: REG_SOURCES.ASURANSI_BPJS }),
            mkQuizLesson('S4.U18.ST1.P3', 'Asuransi Tradisional Murni vs Unit Link', 'Pure Insurance vs Unit Link', 'Memahami biaya akuisisi Unit Link & siapa yang butuh asuransi jiwa.', [
              {
                id: 's4u18s1p3_q1',
                promptId:
                  'Seorang mahasiswa lajang tanpa tanggungan ekonomi siapa pun ditawari Asuransi Jiwa Unit Link dengan janji "Bonus pasti balik modal untung besar 200% di tahun ke-10!". Apa koreksi kritis paling tepat?',
                promptEn: 'Single student with no dependents pitched Unit Link with "Guaranteed 200% return in year 10!". Critique?',
                optionsId: [
                  'Jiwa lindungi tanggungan nafkah; Unit Link potong akuisisi & hasilnya tak dijamin',
                  'Produk Unit Link dijamin aturan memberi hasil 200% di tahun kesepuluh aktif',
                  'Seluruh premi masuk penuh ke tabungan tunai bebas akuisisi serta bebas risiko',
                  'Asuransi jiwa wajib dimiliki mahasiswa lajang sebelum bangun Dana Darurat',
                ],
                optionsEn: [
                  'Life insurance protects dependents; Unit Link cuts acquisition fees & carries market risk',
                  'Unit Link yields a legally guaranteed 200% return payout by year ten',
                  '100% of premiums build fee-free savings withdrawable at guaranteed profit',
                  'Life policies take priority for single students before building an Emergency Fund',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Asuransi bukan tabungan atau investasi bebas risiko. Membeli asuransi jiwa saat belum punya tanggungan mengorbankan Dana Darurat & investasi terpisah.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.ASURANSI_BPJS,
                  next: 'Jika butuh proteksi, bandingkan Asuransi Tradisional Murni + investasi di reksadana/SBN terpisah secara transparan.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.ASURANSI_BPJS }),
          ],
        },
        {
          id: 'S4.U18.ST2',
          stageNumber: '18.2',
          titleId: 'Membaca Polis & Mekanisme Klaim',
          titleEn: 'Reading Policy Clauses & Claims',
          skipExamId: 'SKIP.S4.U18.ST2',
          paths: [
            mkPairLesson('S4.U18.ST2.P1', '4 Istilah Penentu Pencairan Klaim di Buku Polis', '4 Key Policy Terms Match', 'Memahami Waiting Period, Exclusions, Inner Limit, & Lapse.', {
              mode: 'pairs',
              instructionId: 'Cocokkan istilah polis asuransi dengan konsekuensi nyatanya saat mengajukan klaim.',
              instructionEn: 'Match each policy clause to its real claim consequence.',
              pairs: [
                { id: 'pl1', leftId: 'Waiting Period (Masa Tunggu)', leftEn: 'Waiting Period', rightId: 'Periode awal polis aktif saat penyakit tertentu belum ditanggung (kecuali klausul pengecualian eksplisit mis. kecelakaan)', rightEn: 'Initial period before specified illness cover begins' },
                { id: 'pl2', leftId: 'Exclusions (Pengecualian)', leftEn: 'Exclusions', rightId: 'Daftar penyakit, tindakan, atau aktivitas berisiko yang sejak awal tertulis TIDAK ditanggung', rightEn: 'Written list of uncovered events' },
                { id: 'pl3', leftId: 'Batas Plafon / Inner Limit Kamar', leftEn: 'Daily Room Inner Limit', rightId: 'Batas maksimal tarif kamar per hari pada polis skema limit (selisihnya menjadi excess claim)', rightEn: 'Daily maximum room tariff cap triggering excess if exceeded' },
                { id: 'pl4', leftId: 'Polis Lapse', leftEn: 'Policy Lapse', rightId: 'Polis tidak aktif akibat menunggak premi melewati masa tenggang (grace period) sehingga manfaat klaim gugur', rightEn: 'Terminated coverage from missed payment past grace period' },
              ],
              explanationCard: card({
                why: 'Mayoritas sengketa klaim asuransi muncul karena nasabah hanya mendengar janji lisan agen tanpa membaca bagian Masa Tunggu, Pengecualian, dan skema Plafon di polis.',
                next: 'Periksa skema plafon kamar (Inner Limit vs As-Charged) sebelum memilih kamar rawat inap rumah sakit.',
              }),
            }),
            mkDetektifLesson('S4.U18.ST2.P2', 'Audit Klaim Berdasarkan Kutipan Polis Eksplisit', 'Fictional Policy Clause Audit', 'Menganalisis kasus klaim dari teks polis eksplisit (kecelakaan bebas tunggu, inner limit, pre-existing berisiko ditolak).', [
              {
                id: 'u18_c1',
                channel: 'Polis',
                senderTitle: 'Polis Kesehatan "Fiktif" (Aktif 1 Oktober): Klausul Tertulis: "Kecelakaan Dikecualikan dari Masa Tunggu 30 Hari"',
                documentLines: [
                  '• Tanggal Polis Aktif        : 1 Oktober',
                  '• Masa Tunggu Penyakit Umum  : 30 hari | Penyakit Khusus (batu empedu/kista): 12 bulan',
                  '• Klausul Khusus Tertulis    : Kecelakaan lalu lintas/trauma mendadak setelah polis aktif DIKECUALIKAN dari masa tunggu 30 hari penyakit',
                  '• Kasus 1: Tertanggung mengalami kecelakaan lalu lintas tanggal 15 Oktober dan dirawat di IGD',
                ],
                questionId: 'Merujuk teks polis eksplisit di atas, bagaimana status klaim kecelakaan tanggal 15 Oktober?',
                optionsId: [
                  { id: 'o1', labelId: 'AMAN / DITANGGUNG: Klausul polis secara eksplisit mengecualikan kecelakaan setelah polis aktif dari masa tunggu 30 hari penyakit', verdict: 'AMAN' },
                  { id: 'o2', labelId: 'BAHAYA: Pasti ditolak karena seluruh kejadian di bawah 30 hari selalu tidak berlaku', verdict: 'BAHAYA' },
                  { id: 'o3', labelId: 'WASPADA: Hanya ditanggung jika sakit demam, bukan kecelakaan', verdict: 'WASPADA' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'fakta_terobservasi',
                explanationCard: card({
                  why: 'Berdasarkan kutipan polis eksplisit yang tampil di layar, pengecualian tertulis menyatakan kecelakaan setelah polis aktif tetap ditanggung tanpa menunggu 30 hari!',
                  assume: 'Simulasi berdasarkan teks polis fiktif di layar; polis aktual tetap bergantung pada bunyi kontrak masing-masing.',
                  type: 'simulation_assumption',
                  next: 'Pastikan selalu membaca pengecualian masa tunggu untuk kecelakaan di kontrak polis aslimu.',
                }),
              },
              {
                id: 'u18_c2',
                channel: 'Polis',
                senderTitle: 'Kasus 2 & 3: Operasi Batu Empedu Bulan ke-3 & Riwayat Jantung Tidak Dideklarasikan',
                documentLines: [
                  '• Kasus A: Operasi batu empedu tanggal 10 Desember (bulan ke-3, sementara masa tunggu penyakit khusus 12 bulan)',
                  '• Kasus B: Penyakit jantung sudah diderita 3 tahun sebelum mendaftar namun sengaja tidak ditulis di formulir SPAJ (pre-existing tersembunyi)',
                ],
                questionId: 'Bagaimana status wajar kedua kasus klaim ini menurut ketentuan polis standar?',
                optionsId: [
                  { id: 'o1', labelId: 'BERISIKO DITOLAK / DIBATALKAN SESUAI POLIS, Kasus A di dalam masa tunggu 12 bulan; Kasus B berisiko ditolak atau dibatalkan karena melanggar kejujuran deklarasi pre-existing', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Keduanya wajib dibayar 100% tanpa cek riwayat medis atau masa tunggu', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'AMAN: Pre-existing tidak perlu ditulis agar premi murah', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Masa tunggu 12 bulan berlaku tegas pada batu empedu. Untuk kondisi pre-existing yang disembunyikan, kontrak polis menempatkannya sebagai pelanggaran itikad baik sehingga klaim berisiko ditolak atau dipersengketakan sesuai klausul polis (bukan ditolak mutlak tanpa tinjauan berkas).',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.ASURANSI_BPJS,
                  next: 'Deklarasikan riwayat kesehatan sejujur-jujurnya saat pendaftaran polis agar klaim di masa depan aman.',
                }),
              },
              {
                id: 'u18_c3',
                channel: 'Polis',
                senderTitle: 'Kasus 4: Polis Berskema Plafon Kamar Harian Tetap (Inner Limit Rp1.000.000/hari)',
                documentLines: [
                  '• Skema Polis Tertulis: Batas kamar harian tetap (inner limit) Rp1.000.000/hari',
                  '• Pasien memilih naik kelas ke kamar VIP seharga Rp2.200.000/hari selama rawat inap',
                ],
                questionId: 'Konsekuensi apa yang muncul saat pemulangan pasien dari rumah sakit?',
                optionsId: [
                  { id: 'o1', labelId: 'WASPADA (EXCESS CLAIM): Selisih kamar Rp1.200.000/hari (dan potensi penyesuaian prorata bila diatur polis) wajib dibayar sendiri oleh pasien', verdict: 'WASPADA' },
                  { id: 'o2', labelId: 'AMAN: Asuransi otomatis menaikkan batas plafon menjadi Rp2,2jt tanpa biaya', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'BAHAYA: Pasien tidak boleh keluar rumah sakit selamanya', verdict: 'BAHAYA' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'fakta_terobservasi',
                explanationCard: card({
                  why: 'Pada polis berskema batas kamar harian tetap (inner limit), biaya di atas limit Rp1.000.000/hari dibebankan sebagai selisih excess kepada pasien.',
                  calc: 'Rp2.200.000 − Rp1.000.000 = Rp1.200.000/hari tanggungan pribadi.',
                  assume: 'Mengasumsikan polis memakai skema inner limit kamar harian tetap, berbeda dari polis as-charged sesuai kelas.',
                  next: 'Tunjukkan kartu/polis kepada admin RS saat masuk agar kamar sesuai plafon hakmu.',
                }),
              },
            ], { st: 'simulation_assumption' }),
            mkStoryLesson('S4.U18.ST2.P3', 'Mengatur Proteksi & Klaim Keluarga', 'Protection & Claim Flow', 'Menyusun proteksi keluarga hemat & melengkapi contoh dokumen klaim secara realistis.', {
              titleId: 'Mengatur Lapis Proteksi & Mengajukan Klaim',
              subtitleId: 'Simulasi Pilihan Premi Terukur, Kejujuran SPAJ & Contoh Kelengkapan Dokumen Klaim',
              durationLabelId: '3 Babak Simulasi',
              initialState: { cash: 4_000_000, emergencyFund: 6_000_000, sinkingFund: 1_000_000, debt: 0, netWorth: 11_000_000 },
              chapters: [
                {
                  id: 'u18_b1',
                  periodLabelId: 'Babak 1: Anggaran Premi Keluarga Terbatas',
                  narrativeId: 'Pencari nafkah bergaji Rp7 juta/bulan ingin melindungi keluarga (BPJS sudah aktif). Agen menawarkan Unit Link Rp2,5 juta/bulan, atau Asuransi Jiwa Berjangka (Term Life) murni Rp250rb/bulan.',
                  choices: [
                    { id: 'c1', labelId: 'Pilih Asuransi Jiwa Berjangka Murni Rp250rb/bln + lanjutkan BPJS Kesehatan & sisa dana ke Dana Darurat/aset terpisah', feedbackId: 'Efisien! Proteksi tinggi untuk keluarga tercukupi tanpa membebani arus kas.', deltas: { cash: -250_000, emergencyFund: 1_000_000, scoreCashflow: 25, scoreRisk: 30 }, isRecommended: true },
                    { id: 'c2', labelId: 'Ambil Unit Link Rp2,5jt/bln lalu menunggak di bulan ke-5 hingga polis lapse', feedbackId: 'Premi kebesaran memicu polis lapse dan uang awal banyak terpotong biaya akuisisi!', deltas: { cash: -2_500_000, scoreRisk: -25 } },
                  ],
                },
                {
                  id: 'u18_b2',
                  periodLabelId: 'Babak 2: Pengisian Formulir Kesehatan (SPAJ)',
                  narrativeId: 'Tahun lalu kamu pernah dirawat karena gejala maag kronis. Agen nakal menyarankan "Kosongkan saja kolom riwayat sakit supaya langsung disetujui."',
                  choices: [
                    { id: 'c1', labelId: 'Isi seluruh riwayat kesehatan secara jujur dan tertulis agar kontrak polis kuat & terhindar dari penolakan klaim di kemudian hari', feedbackId: 'Keputusan jujur melindungi hak klaim legal keluargamu di masa krisis!', deltas: { scoreSecurity: 30, scoreRisk: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Ikuti saran menyembunyikan riwayat kesehatan', feedbackId: 'Saat klaim nanti ditemukan rekam medis RS terdahulu, klaim berisiko ditolak atau polis dibatalkan!', deltas: { scoreSecurity: -30 } },
                  ],
                },
                {
                  id: 'u18_b3',
                  periodLabelId: 'Babak 3: Mengajukan Klaim Reimbursement Rawat Inap',
                  narrativeId: 'Setelah rawat inap darurat sesuai plafon, kamu mengajukan klaim reimbursement (catatan: daftar dokumen riil bervariasi tergantung perusahaan asuransi, jenis produk, & jalur klaim).',
                  choices: [
                    { id: 'c1', labelId: 'Lengkapi contoh paket dokumen standar: Resume Medis Dokter, Kuitansi Asli Terinci, Hasil Lab/Penunjang, Formulir Klaim & Kartu Peserta tepat waktu', feedbackId: 'Dokumen lengkap membuat verifikasi klaim cair lancar sesuai manfaat polis!', deltas: { cash: 3_500_000, scoreGoal: 30 }, isRecommended: true },
                    { id: 'c2', labelId: 'Kirim nota totalan tanpa rincian tindakan & tanpa resume medis dokter', feedbackId: 'Klaim tertunda/ditolak administratif karena tidak ada dasar verifikasi medis.', deltas: { cash: -1_500_000, scoreGoal: -15 } },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Proteksi cerdas memilih premi yang mampu dibayar jangka panjang, jujur sejak awal kontrak, dan tertib administrasi dokumen klaim.',
                assume: 'Daftar dokumen klaim dapat berbeda antar penanggung & jenis polis (cashless vs reimbursement).',
                type: 'dynamic_fact',
                reg: REG_SOURCES.ASURANSI_BPJS,
                next: 'Siapkan diri menghadapi Gerbang UTS Semester 4!',
              }),
            }),
          ],
        },
      ],
    },

    // ================= UNIT 19 =================
    {
      id: 'S4.U19',
      unitNumber: 19,
      semesterId: 'S4',
      titleId: 'Inflasi, Daya Beli & Nilai Waktu Uang',
      titleEn: 'Inflation, Purchasing Power & Time Value of Money',
      guidebook: {
        summaryId:
          'Inflasi adalah kenaikan umum harga barang & jasa lintas waktu yang menurunkan daya beli (nilai riil) uang tunai yang diam. Rp1 juta hari ini lebih bernilai dari Rp1 juta 10 tahun mendatang karena dapat dimanfaatkan atau diinvestasikan hari ini (Time Value of Money). Gunakan aproksimasi cepat (Bunga − Inflasi) maupun rumus eksak Fisher: (1 + r_nom)/(1 + inflasi) − 1.',
        summaryEn: 'Inflation erosion, TVM fundamentals, fast vs exact Fisher real return formula.',
        keyRulesId: [
          'Nominal uang kertas di toples tetap Rp100.000, tetapi daya beli riilnya menyusut setiap tahun akibat inflasi.',
          'Bunga bersih 0,5% vs inflasi 3,5%: pendekatan pemula = -3,0%/th, rumus eksak Fisher = (1,005/1,035) − 1 = -2,90%/th.',
          'Setelah Dana Darurat likuid terpenuhi, alokasikan kelebihan dana jangka panjang secara terukur agar tak terkikis inflasi.',
        ],
        keyRulesEn: [
          'Idle cash preserves nominal value while losing real purchasing power.',
          'Exact Fisher real return is (1 + r) / (1 + i) - 1.',
          'Deploy surplus long-term cash beyond emergency needs to counter inflation.',
        ],
        disclaimerId: 'Konsep tetap matematika ekonomi dengan parameter simulasi laju inflasi tahunan.',
        disclaimerEn: 'Core economic principle with illustrative inflation parameters.',
      },
      stages: [
        {
          id: 'S4.U19.ST1',
          stageNumber: '19.1',
          titleId: 'Melawan Inflasi & Nilai Riil',
          titleEn: 'Fighting Inflation & Real Return',
          skipExamId: 'SKIP.S4.U19.ST1',
          paths: [
            mkQuizLesson('S4.U19.ST1.P1', 'Keranjang Belanja & Imbal Hasil Riil Fisher', 'Purchasing Power & Fisher Real Return', 'Menghitung imbal hasil riil dengan aproksimasi pemula & rumus eksak Fisher.', [
              {
                id: 's4u19s1p1_q1',
                promptId:
                  'Tahun 2015 biaya 1 paket sembako dasar Rp100.000. Jika rata-rata inflasi barang 4%/tahun, mengapa selembar Rp100.000 yang disimpan utuh di toples rumah pada tahun 2025 tidak lagi dapat membeli paket sembako ukuran yang sama?',
                promptEn: 'Why can Rp100,000 kept in a jar for 10 years at 4% inflation no longer buy the same grocery basket?',
                optionsId: [
                  'Daya beli riil uang menyusut tergerus inflasi meski angka nominalnya tetap',
                  'Uang tunai yang disimpan lama di rumah otomatis terkena potongan pajak bank',
                  'Nilai nominal pecahan Rp100.000 otomatis diturunkan bank sentral tiap 5 tahun',
                  'Harga pangan pokok turun tajam saat jumlah peredaran barang semakin terbatas',
                ],
                optionsEn: [
                  'Real purchasing power falls as prices compound while face value stays constant',
                  'Cash kept at home automatically triggers dormant bank maintenance penalties',
                  'Face values of Rp100,000 notes are devalued by authorities every five years',
                  'Staple grocery prices fall sharply whenever goods circulate slowly over decades',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Inflasi menggerus kemampuan tukar (nilai riil) uang yang tidak bertumbuh. Dengan inflasi 4%/th selama 10 tahun, paket seharga Rp100rb naik ke kisaran Rp148rb.',
                  next: 'Bedakan antara uang untuk cadangan cair jangka pendek vs aset bertumbuh jangka panjang.',
                }),
              },
              {
                id: 's4u19s1p1_q2',
                promptId:
                  'Rekening simpanan memberi bunga bersih 0,5%/tahun sementara inflasi berjalan 3,5%/tahun. Berapa tingkat imbal hasil riil per tahun menurut pendekatan cepat pemula DAN rumus eksak Fisher `(1 + r)/(1 + i) − 1`?',
                promptEn: 'Net interest 0.5%/yr vs inflation 3.5%/yr. Quick approx & exact Fisher real return?',
                optionsId: [
                  'Pendekatan cepat -3,0%/th dan eksak Fisher -2,90%/th',
                  'Pendekatan cepat +3,0%/th dan eksak Fisher +2,90%/th',
                  'Pendekatan cepat +4,0%/th dan eksak Fisher +4,02%/th',
                  'Pendekatan cepat -0,5%/th dan eksak Fisher 0,00%/th',
                ],
                optionsEn: [
                  'Quick approx -3.0%/yr and exact Fisher -2.90%/yr',
                  'Quick approx +3.0%/yr and exact Fisher +2.90%/yr',
                  'Quick approx +4.0%/yr and exact Fisher +4.02%/yr',
                  'Quick approx -0.5%/yr and exact Fisher 0.00%/yr',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Imbal hasil di bawah laju inflasi berarti nilai riil tabunganmu negatif, kekayaan kelihatan bertambah nominalnya namun melemah daya belinya.',
                  calc: 'Cepat = 0,5% − 3,5% = -3,0%. Eksak Fisher = (1 + 0,005) / (1 + 0,035) − 1 = 1,005 / 1,035 − 1 = -0,02898 ≈ -2,90%!',
                  next: 'Gunakan rumus Fisher agar perhitungan riil lebih akurat khususnya pada tingkat bunga atau inflasi yang lebih tinggi.',
                }),
              },
              {
                id: 's4u19s1p1_q3',
                promptId:
                  '[Analitik HOTS] Kamu ditawari deposito bank dengan bunga bruto 4,5%/tahun (pajak PPh final bunga deposito 20%), sementara tingkat inflasi tahunan saat ini sebesar 4,0%. Berapa perkiraan imbal hasil riil bersihmu dengan rumus Fisher setelah memperhitungkan pajak?',
                promptEn: '[HOTS] Bank deposit pays 4.5%/yr gross (20% final interest tax) while inflation runs at 4.0%/yr. What is the after-tax Fisher real return?',
                optionsId: ['-0,38%/tahun', '+0,48%/tahun', '+3,60%/tahun', '+0,96%/tahun'],
                optionsEn: ['-0.38%/year', '+0.48%/year', '+3.60%/year', '+0.96%/year'],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Kesalahan analisis (C4-C5) paling sering terjadi saat membandingkan bunga BRUTO produk melawan inflasi tanpa memotong pajak PPh 20% dan biaya admin terlebih dahulu!',
                  calc: 'Bunga bersih = 4,5% × (1 − 20%) = 3,60%/th. Eksak Fisher = (1,036 ÷ 1,040) − 1 = -0,003846 ≈ -0,38%/tahun.',
                  assume: 'Mengasumsikan PPh final bunga deposito 20% berlaku sesuai ambang saldo simpanan kena pajak di perbankan.',
                  next: 'Selalu pakai angka imbal hasil BERSIH setelah pajak & biaya sebelum menghitung kemenangan terhadap inflasi.',
                  type: 'simulation_assumption',
                }),
              },
            ]),
            mkWordleLesson('S4.U19.ST1.P2', 'Kosakata Daya Beli & Inflasi', 'Inflation & TVM Terms', 'Menguasai istilah inflasi, daya, riil, dan nominal.', [
              { word: 'INFLASI', clueId: 'Kenaikan harga barang dan jasa secara umum berkelanjutan yang menurunkan daya beli.', clueEn: 'General price rise eroding purchasing power.', definitionId: 'Proses meningkatnya tingkat harga umum dari waktu ke waktu dalam suatu perekonomian.', definitionEn: 'Sustained increase in general price levels.', exampleId: 'Menghitung selisih imbal hasil investasi terhadap laju inflasi tahunan.', exampleEn: 'Comparing portfolio returns against annual inflation.' },
              { word: 'DAYA', clueId: 'Kemampuan riil uang untuk membeli sejumlah barang/jasa (daya beli).', clueEn: 'Purchasing strength of money (daya beli).', definitionId: 'Jumlah barang atau jasa nyata yang sanggup dibeli dengan nominal uang tertentu.', definitionEn: 'Real goods/services capacity of money.', exampleId: 'Daya beli Rp100.000 sepuluh tahun lalu lebih besar daripada hari ini.', exampleEn: 'Purchasing power a decade ago exceeded today.' },
              { word: 'RIIL', clueId: 'Nilai atau imbal hasil sesungguhnya setelah memperhitungkan pengaruh inflasi.', clueEn: 'Inflation-adjusted real value or return.', definitionId: 'Ukuran nilai bersih daya beli setelah disesuaikan laju kenaikan harga (rumus Fisher).', definitionEn: 'Return/value adjusted for inflation.', exampleId: 'Bunga 5% di tengah inflasi 3% memberi hasil riil sekitar +1,94% (Fisher).', exampleEn: '5% nominal minus 3% inflation leaves ~1.94% Fisher real return.' },
              { word: 'NOMINAL', clueId: 'Angka rupiah yang tercetak atau tertulis di saldo sebelum disesuaikan inflasi.', clueEn: 'Unadjusted face monetary figure.', definitionId: 'Nilai uang secara angka matematis langsung tanpa koreksi perubahan daya beli.', definitionEn: 'Face value unadjusted for inflation.', exampleId: 'Uang nominal Rp1 juta tetap tertulis Rp1 juta meski harga kebutuhan naik.', exampleEn: 'Nominal Rp1M label unchanged despite rising prices.' },
            ]),
            mkPohonLesson('S4.U19.ST1.P3', 'Pohon Aset Mode Melawan Inflasi', 'Beating Inflation', 'Anti bias konservatif mutlak: menunjukkan tabungan kas 0,5% kalah oleh inflasi 3,5% untuk tujuan 10 tahun.', {
              mode: 'inflasi',
              scenarioTitleId: 'Target Biaya Pendidikan 10 Tahun Naik Mengikuti Inflasi',
              scenarioIntroId:
                'Dana Darurat likuidmu SUDAH TERCUKUPI di rekening terpisah! Kini kamu mengelola surplus jangka panjang Rp20 juta untuk dana kuliah 10 tahun lagi, sementara biaya pendidikan naik mengikuti inflasi!',
              horizonLabelId: 'Proyeksi Lintas Inflasi (10 Tahun)',
              initialCash: 20_000_000,
              initialInvested: 0,
              targetGoalAmount: 36_000_000,
              quarters: [
                {
                  quarterLabelId: 'Tahun 1–3: Memilih Alokasi Kelebihan Dana (Di Luar Dana Darurat)',
                  eventTitleId: 'Biaya Pendidikan Terus Merangkak Naik +6%/Tahun',
                  eventDescId: 'Sebagian pemain mengira menaruh SEMUA dana jangka 10 tahun di tabungan 0,5% itu selalu pilihan paling aman dan benar.',
                  macroWeather: 'INFLASI',
                  options: [
                    {
                      id: 'inf1_opt1',
                      labelId: 'Alokasikan dana jangka 10 tahun ke portofolio aset produktif berimbang penahan inflasi (karena Dana Darurat sudah aman)',
                      descId: 'Menghadapi volatilitas jangka pendek demi imbal hasil riil positif jangka panjang.',
                      cashDelta: -15_000_000,
                      investedDelta: 18_500_000,
                      riskExposureScore: 55,
                      inflationProtectionScore: 90,
                      liquidityScore: 60,
                      feedbackId: 'Tepat! Mengalokasikan uang dingin jangka panjang mencegah kekayaan tergerus inflasi diam-diam.',
                      isOptimal: true,
                    },
                    {
                      id: 'inf1_opt2',
                      labelId: 'Simpan 100% surplus 10 tahun di tabungan/celengan 0,5% agar tidak pernah melihat angka turun',
                      descId: 'Nilai nominal tampak aman, tetapi daya beli tergerus -2,9% s.d. -5% per tahun terhadap inflasi biaya sekolah!',
                      cashDelta: 200_000,
                      investedDelta: 0,
                      riskExposureScore: 5,
                      inflationProtectionScore: 5,
                      liquidityScore: 95,
                      feedbackId: 'Terjebak bias konservatif mutlak! Target kuliah menjauh karena kalah telak oleh inflasi.',
                    },
                  ],
                },
                {
                  quarterLabelId: 'Tahun 4–7: Volatilitas Sementara vs Konsistensi',
                  eventTitleId: 'Gejolak Inflasi Pangan & Koreksi Pasar Sesaat',
                  eventDescId: 'Portofolio jangka panjang sempat turun sementara -8% akibat kabar suku bunga naik. Masih ada waktu 6 tahun ke kuliah anak.',
                  macroWeather: 'KRISIS',
                  options: [
                    {
                      id: 'inf2_opt1',
                      labelId: 'Pertahankan portofolio jangka panjang & tambah kontribusi berkala sesuai rencana tanpa panik mencairkan ke celengan',
                      descId: 'Horizon waktu masih panjang untuk melewati fluktuasi normal pasar.',
                      cashDelta: -3_000_000,
                      investedDelta: 7_500_000,
                      riskExposureScore: 50,
                      inflationProtectionScore: 85,
                      liquidityScore: 65,
                      feedbackId: 'Tenang! Pada horizon panjang, disiplin menjaga aset produktif memulihkan nilai dan melampaui inflasi.',
                      isOptimal: true,
                    },
                    {
                      id: 'inf2_opt2',
                      labelId: 'Panik jual seluruh aset di harga bawah lalu biarkan menganggur di kas 0,5% selamanya',
                      descId: 'Mengunci kerugian sementara dan kembali menanggung erosi inflasi.',
                      cashDelta: 12_000_000,
                      investedDelta: -14_000_000,
                      riskExposureScore: 10,
                      inflationProtectionScore: 10,
                      liquidityScore: 90,
                      feedbackId: 'Panic selling menghancurkan peluang pemulihan daya beli jangka panjang.',
                    },
                  ],
                },
                {
                  quarterLabelId: 'Tahun 8–10: Mendekati Jatuh Tempo Kuliah',
                  eventTitleId: '2 Tahun Menjelang Pembayaran Uang Pangkal',
                  eventDescId: 'Dana sudah tumbuh kuat dan jadwal masuk kuliah tinggal 2 tahun lagi.',
                  macroWeather: 'NORMAL',
                  options: [
                    {
                      id: 'inf3_opt1',
                      labelId: 'Mulai geser bertahap ke instrumen rendah fluktuasi (Pasar Uang / Deposito / SBN pendek) agar nominal target siap pakai terlindungi',
                      descId: 'Mengamankan hasil pertumbuhan jangka panjang sebelum hari-H pencairan.',
                      cashDelta: 18_000_000,
                      investedDelta: -14_000_000,
                      riskExposureScore: 15,
                      inflationProtectionScore: 70,
                      liquidityScore: 95,
                      feedbackId: 'Strategi transisi horizon (glide path) berhasil! Dana kuliah terpenuhi melampaui inflasi.',
                      isOptimal: true,
                    },
                    {
                      id: 'inf3_opt2',
                      labelId: 'Biarkan 100% di saham agresif sampai H-1 minggu daftar ulang kuliah',
                      descId: 'Berisiko tinggi jika pasar tiba-tiba terkoreksi tepat di bulan pendaftaran.',
                      cashDelta: -1_000_000,
                      investedDelta: 0,
                      riskExposureScore: 90,
                      inflationProtectionScore: 60,
                      liquidityScore: 40,
                      feedbackId: 'Terlalu berisiko ketika jadwal penggunaan dana sudah sangat dekat!',
                    },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Tidak ada satu pilihan aman untuk semua situasi: kas/tabungan cocok untuk Dana Darurat & < 1 tahun, tetapi kalah oleh inflasi jika dipakai untuk tujuan 10 tahun. Gunakan aset tumbuh dulu lalu geser bertahap ke wadah stabil menjelang hari-H!',
                type: 'simulation_assumption',
                next: 'Lanjutkan ke Unit 20 untuk melihat daya ungkit waktu dan bunga majemuk.',
              }),
            }),
          ],
        },
      ],
    },

    // ================= UNIT 20 =================
    {
      id: 'S4.U20',
      unitNumber: 20,
      semesterId: 'S4',
      titleId: 'Kekuatan Waktu & Bunga Majemuk',
      titleEn: 'Power of Time & Compounding',
      guidebook: {
        summaryId:
          'Bunga Sederhana selalu dihitung dari pokok awal, sedangkan Bunga Majemuk (Compounding) menghitung imbal hasil dari pokok awal + akumulasi hasil sebelumnya. Seluruh ilustrasi 3–20 tahun memakai asumsi eksplisit (imbal hasil hipotetis tetap tahunan, tanpa biaya, sebelum pajak, & sebelum inflasi). Ingat pula sifat dua arah: bunga/denda berbunga bisa menguntungkan saat berinvestasi, namun menghancurkan jika membiarkan utang menunggak sesuai kontrak sah.',
        summaryEn: 'Simple vs Compound interest, explicit long-term modeling assumptions, and double-edged debt compounding.',
        keyRulesId: [
          'Rp10jt dengan return hipotetis tetap 10%/th: Tahun ke-3 = Rp13.310.000 (sederhana Rp13jt); Tahun ke-20 = ~Rp67,27 juta (sederhana Rp30jt).',
          'Memulai lebih dini dengan setoran bulanan kecil sering mengalahkan yang memulai telat meski setorannya jauh lebih besar.',
          'Pada sisi negatif, bunga berjalan dan denda keterlambatan kontrak pinjaman ikut memperbesar saldo kewajiban jika dibiarkan menunggak.',
        ],
        keyRulesEn: [
          'Compounding accelerates exponentially over time under equal rate assumptions.',
          'Starting early often beats larger late contributions.',
          'Unpaid high-interest debt compounds against the borrower.',
        ],
        disclaimerId:
          'Asumsi Simulasi: Contoh pertumbuhan majemuk bersifat ilustratif (asumsi return hipotetis konstan, sebelum biaya, pajak, & inflasi, return produk riil berfluktuasi).',
        disclaimerEn: 'Simulation Assumption: Constant illustrative returns exclude real-world volatility, fees & taxes.',
      },
      stages: [
        {
          id: 'S4.U20.ST1',
          stageNumber: '20.1',
          titleId: 'Bunga Sederhana vs Majemuk',
          titleEn: 'Simple vs Compound Interest',
          skipExamId: 'SKIP.S4.U20.ST1',
          paths: [
            mkWordleLesson('S4.U20.ST1.P1', 'Kosakata Bunga Majemuk', 'Compounding Terms', 'Menguasai istilah majemuk, imbal, waktu, periode.', [
              { word: 'MAJEMUK', clueId: 'Skema bunga berbunga di mana imbal hasil tahun lalu ikut menghasilkan imbal hasil tahun ini.', clueEn: 'Interest earning interest over periods.', definitionId: 'Pertumbuhan eksponensial aset ketika hasil investasi diinvestasikan kembali ke pokok.', definitionEn: 'Compounding growth across reinvested returns.', exampleId: 'Modal Rp10jt 10%/th majemuk tumbuh ke Rp13.310.000 pada tahun ke-3.', exampleEn: 'Rp10M compounded at 10% reaches Rp13.31M in 3 years.' },
              { word: 'IMBAL', clueId: 'Persentase hasil investasi atau tingkat pengembalian modal per periode (imbal hasil).', clueEn: 'Percentage rate of return on capital.', definitionId: 'Keuntungan maupun bunga yang diperoleh investor dibandingkan modal tertanam.', definitionEn: 'Yield or return rate generated on capital.', exampleId: 'Bandingkan imbal hasil neto setelah dikurangi biaya pengelolaan dan pajak.', exampleEn: 'Compare net yield after fees and taxes.' },
              { word: 'WAKTU', clueId: 'Faktor pengungkit terkuat pada bunga majemuk karena eksponen bekerja di pangkat jumlah periode.', clueEn: 'Strongest multiplier exponent in compounding.', definitionId: 'Horizon jangka investasi yang memberi ruang pertumbuhan berlipat secara alami.', definitionEn: 'Duration allowing exponential accumulation.', exampleId: 'Mulai berinvestasi teratur di usia 22 tahun memanfaatkan panjangnya faktor waktu.', exampleEn: 'Starting at age 22 harnesses multi-decade compounding.' },
              { word: 'PERIODE', clueId: 'Satuan rentang penghitungan bunga, seperti bulanan, kuartalan, atau tahunan.', clueEn: 'Compounding interval cycle.', definitionId: 'Frekuensi pencatatan atau penggulungan imbal hasil ke saldo pokok.', definitionEn: 'Frequency at which returns compound.', exampleId: 'Bunga pinjaman berbunga harian jauh lebih memberatkan daripada majemuk tahunan.', exampleEn: 'Daily debt compounding escalates faster than annual.' },
            ]),
            mkQuizLesson('S4.U20.ST1.P2', 'Perbandingan Bunga Sederhana vs Bunga Majemuk', 'Simple vs Compound Math', 'Menghitung pertumbuhan 3 tahun & proyeksi hipotetis 20 tahun dengan asumsi jelas.', [
              {
                id: 's4u20s1p2_q1',
                promptId:
                  '(Asumsi simulasi: imbal hasil hipotetis tetap 10%/tahun, tanpa biaya admin, sebelum pajak & inflasi) Modal Rp10.000.000 selama 3 tahun. Berapa hasil Bunga Sederhana dibanding Bunga Majemuk?',
                promptEn: 'Rp10M at fixed hypothetical 10%/yr for 3 years (pre-tax/fee). Simple vs Compound total?',
                optionsId: [
                  'Sederhana Rp13.000.000 vs Majemuk Rp13.310.000',
                  'Sederhana Rp13.000.000 vs Majemuk Rp13.000.000',
                  'Sederhana Rp13.310.000 vs Majemuk Rp13.650.000',
                  'Sederhana Rp11.000.000 vs Majemuk Rp13.300.000',
                ],
                optionsEn: [
                  'Simple Rp13,000,000 vs Compound Rp13,310,000',
                  'Simple Rp13,000,000 vs Compound Rp13,000,000',
                  'Simple Rp13,310,000 vs Compound Rp13,650,000',
                  'Simple Rp11,000,000 vs Compound Rp13,300,000',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Pada bunga sederhana tambahan tiap tahun datar (Rp1jt), sedangkan pada bunga majemuk basis hitungnya naik tiap tahun.',
                  calc: 'Majemuk: Th 1 = Rp11.000.000 → Th 2 = Rp12.100.000 → Th 3 = Rp13.310.000. Pada Th 20: 10jt × (1,1)^20 = Rp67.274.999 (~Rp67,27jt vs Rp30jt sederhana!).',
                  assume: 'Simulasi matematika murni memakai return hipotetis konstan 10%/th sebelum biaya, pajak, & inflasi.',
                  type: 'simulation_assumption',
                  next: 'Semakin panjang waktumu, semakin terasa selisih bunga majemuk dibanding bunga sederhana.',
                }),
              },
              {
                id: 's4u20s1p2_q2',
                promptId:
                  '[Analitik HOTS] Dengan asumsi imbal hasil hipotetis setara, Nadia mulai berinvestasi Rp500rb/bulan sejak usia 22 tahun lalu BERHENTI menabung di usia 32 (total setor 10 tahun = Rp60jt, dibiarkan bertumbuh hingga usia 55). Aldi baru mulai di usia 32 dengan Rp500rb/bulan sampai usia 55 (total setor 23 tahun = Rp138jt). Mengapa akumulasi Nadia sering kali tetap lebih unggul saat usia 55?',
                promptEn: '[HOTS] At equal hypothetical return, Nadia invests Rp500k/mo from age 22-32 (Rp60M principal) and stops until 55, whereas Aldi starts at 32 until 55 (Rp138M principal). Why can Nadia still finish ahead?',
                optionsId: [
                  'Modal awal Nadia mendapat 23–33 tahun penggulungan bunga majemuk tambahan yang sulit terkejar meski setor pokok lebih kecil',
                  'Total pokok setoran Rp60 juta milik Nadia dihitung bernilai dua kali lipat oleh peraturan pengawas bursa',
                  'Investasi yang dimulai setelah usia 30 tahun dikenakan pemotongan bunga majemuk tahunan oleh bank kustodian',
                  'Bunga majemuk otomatis berhenti bekerja setelah tahun kesepuluh jika tidak ada setoran rutin baru setiap bulan',
                ],
                optionsEn: [
                  'Early principal compounds across extra decades, outweighing larger late cumulative contributions',
                  'Early principal contributions are legally counted double by exchange regulations',
                  'Investments started past age 30 incur mandatory custodian compounding reductions',
                  'Compounding halts automatically after year ten unless fresh monthly deposits continue',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Variabel paling menentukan dalam rumus bunga majemuk `(1 + r)^t` adalah PANGKAT WAKTU (`t`), bukan hanya seberapa besar modal sekali setor ketika sudah terlambat.',
                  calc: 'Asumsi simulasi hipotetis 8%/th: setoran 10 th Nadia (~Rp91,5jt di usia 32 → dikali 1,08^23 ≈ Rp537jt di usia 55) unggul atas setoran 23 th Aldi (~Rp375jt)!',
                  assume: 'Simulasi mengasumsikan imbal hasil hipotetis konstan untuk ilustrasi konsep waktu; hasil pasar nyata berfluktuasi.',
                  next: 'Mulailah menyisihkan dari angka mampu sedini mungkin daripada menunggu penghasilan sangat besar.',
                  type: 'simulation_assumption',
                }),
              },
            ], { st: 'simulation_assumption' }),
            mkPairLesson('S4.U20.ST1.P3', 'Faktor Waktu & Sisi Dua Arah Compounding', 'Time Advantage & Double-Edged Debt', 'Membandingkan konsistensi usia dini vs keterlambatan & bunga utang.', {
              mode: 'pairs',
              instructionId: 'Cocokkan profil pengelolaan waktu keuangan berikut dengan hasilnya (dengan asumsi tingkat imbal hasil/kontrak setara).',
              instructionEn: 'Match each timing behavior with its long-term outcome.',
              pairs: [
                { id: 'tm1', leftId: 'Rina (Mulai menyisihkan teratur Rp500rb/bln dari usia 22)', leftEn: 'Rina starts early at 22 with Rp500k/mo', rightId: 'Waktu panjang membuat total setor kecil bisa mengalahkan yang telat meski return setara', rightEn: 'Long horizon multiplies smaller early deposits' },
                { id: 'tm2', leftId: 'Bima (Menunda hingga usia 37 lalu mencoba mengejar dengan Rp1jt/bln)', leftEn: 'Bima delays until 37 with Rp1M/mo', rightId: 'Harus menyetor dana pokok bulanan jauh lebih berat untuk mengejar akumulasi usia 55', rightEn: 'Requires much heavier monthly effort later' },
                { id: 'tm3', leftId: 'Sisi Negatif Tunggakan Utang Berbunga Kontrak', leftEn: 'Compound Interest Working Against Borrower', rightId: 'Tunggakan pinjaman/kartu kredit yang menambah bunga & denda sesuai kontrak saat dibiarkan menunggak', rightEn: 'Unpaid debt accumulating ongoing interest & contract penalties' },
              ],
              explanationCard: card({
                why: 'Compounding bekerja seperti kaca pembesar: mempercepat pertumbuhan dana rutin dini maupun memperbesar beban bila membiarkan utang menunggak.',
                assume: 'Besaran bunga serta denda keterlambatan pada utang bergantung penuh pada kontrak pinjaman sah yang berlaku.',
                next: 'Mulailah menyisihkan dari nominal mampu hari ini dan lunasi utang mahal sedini mungkin.',
              }),
            }),
            mkStoryLesson('S4.U20.ST1.P4', 'Peta Tujuan Tiga Horizon', 'Three-Horizon Goal Map', 'Menyeimbangkan likuiditas 6 bulan, biaya nikah/kuliah 3 tahun, dan pensiun 15 tahun.', {
              titleId: 'Peta Tujuan Keuangan Tiga Horizon',
              subtitleId: 'Simulasi Alokasi Trade-Off 6 Bulan vs 3 Tahun vs 15 Tahun',
              durationLabelId: '3 Horizon Simulasi',
              initialState: { cash: 3_000_000, emergencyFund: 6_000_000, sinkingFund: 1_000_000, debt: 0, netWorth: 10_000_000 },
              chapters: [
                {
                  id: 'u20_b1',
                  periodLabelId: 'Horizon 1: Tagihan Pajak & Darurat (< 6 Bulan)',
                  narrativeId: 'Ada kebutuhan membayar perpanjangan kontrak rumah & pajak tahunan dalam 5 bulan mendatang.',
                  choices: [
                    { id: 'c1', labelId: 'Tempatkan di Tabungan Terpisah / Deposito jangka pendek likuid yang pokoknya tak berfluktuasi', feedbackId: 'Tepat! Tujuan < 1 tahun memprioritaskan keamanan pokok dan ketepatan tanggal cair.', deltas: { sinkingFund: 1_500_000, scoreRisk: 25, scoreCashflow: 20 }, isRecommended: true },
                    { id: 'c2', labelId: 'Taruh dana kontrak rumah 5 bulan lagi ke saham volatil demi mengejar bunga majemuk', feedbackId: 'Keliru! Fluktuasi saham jangka pendek bisa minus -20% saat jatuh tempo kontrak rumah tiba.', deltas: { cash: -1_000_000, scoreRisk: -25 } },
                  ],
                },
                {
                  id: 'u20_b2',
                  periodLabelId: 'Horizon 2: Dana Persiapan Usaha / Nikah (3 Tahun)',
                  narrativeId: 'Target Rp30 juta dibutuhkan 3 tahun lagi. Bagaimana komposisinya?',
                  choices: [
                    { id: 'c1', labelId: 'Gunakan instrumen stabil terprediksi berjangka 1–3 tahun (SBN Ritel jangka pendek / Reksadana Pasar Uang / Pendapatan Tetap terukur)', feedbackId: 'Seimbang antara imbal hasil lebih baik daripada tabungan biasa sekaligus menjaga risiko penurunan jelang 3 tahun!', deltas: { netWorth: 2_000_000, scoreGoal: 30 }, isRecommended: true },
                    { id: 'c2', labelId: 'Taruh seluruhnya di toples uang tunai 0%', feedbackId: 'Terkikis inflasi 3 tahun tanpa imbal hasil sama sekali.', deltas: { netWorth: -500_000, scoreGoal: -10 } },
                  ],
                },
                {
                  id: 'u20_b3',
                  periodLabelId: 'Horizon 3: Dana Pensiun / Kemandirian Jangka Panjang (15 Tahun)',
                  narrativeId: 'Setelah kas pendek dan menengah aman, kamu rutin menyisihkan Rp750rb/bulan untuk 15 tahun mendatang.',
                  choices: [
                    { id: 'c1', labelId: 'Manfaatkan instrumen pertumbuhan produktif terdiversifikasi secara rutin bulanan untuk memaksimalkan compounding & melampaui inflasi', feedbackId: 'Optimal! Horizon 15 tahun cukup panjang untuk meredam gejolak sambil memanfaatkan bunga majemuk.', deltas: { netWorth: 5_000_000, scoreGoal: 30, scoreRisk: 20 }, isRecommended: true },
                    { id: 'c2', labelId: 'Berhenti menabung pensiun karena menganggap 15 tahun masih terlalu jauh', feedbackId: 'Melewatkan usia muda menghilangkan tahun compounding terkuat yang tak tergantikan!', deltas: { scoreGoal: -25 } },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Setiap jangka waktu punya instrumen cocoknya masing-masing: pendek = likuiditas & keamanan pokok, menengah = keseimbangan stabilitas, panjang = pertumbuhan mengalahkan inflasi.',
                type: 'simulation_assumption',
                next: 'Saatnya menguji ketahanan krisis, klaim polis & strategi lintas waktu di Gerbang UAS Semester 4!',
              }),
            }),
          ],
        },
      ],
    },
  ],
  uts: buildUTS('S4', 'UTS Semester 4: Dana Darurat & Klaim Polis', 'Unit 17–18', ['S4.U17', 'S4.U18']),
  uas: buildUAS(
    'S4',
    'UAS Semester 4: Ketahanan Krisis, Klaim & Inflasi',
    'Unit 17–20',
    ['S4.U17', 'S4.U18', 'S4.U19', 'S4.U20'],
    'Proyek Ketahanan Krisis, Klaim & Inflasi 12 Bulan',
    12,
    {
      isPerformanceProject: true,
      titleId: 'Proyek UAS S4: Ketahanan Krisis, Klaim & Inflasi 12 Bulan',
      subtitleId: 'Bagian 2 Proyek Kinerja · Bobot 50%: Uji Likuiditas, Kejujuran Polis & Fisher Anti-Inflasi',
      durationLabelId: '12 Bulan Virtual',
      initialState: { cash: 4_000_000, emergencyFund: 12_000_000, sinkingFund: 1_500_000, debt: 0, netWorth: 17_500_000 },
      chapters: [
        {
          id: 's4_uas_1',
          periodLabelId: 'Bulan 1–4: Lapis Proteksi & Penempatan Wadah Dana',
          narrativeId: 'Pilih proteksi (BPJS + Asuransi Murni jujur SPAJ vs Unit Link kemahalan) dan bagi dana antara tabungan darurat 24/7 vs tujuan 15 tahun penahan inflasi.',
          choices: [
            { id: 'c1', labelId: 'Aktifkan Asuransi Murni premi wajar + jujur SPAJ, kunci Rp10jt di rekening darurat likuid, & arahkan surplus jangka panjang ke aset bertumbuh', feedbackId: 'Lapisan risiko kuat dan uang dingin mulai bekerja melawan inflasi!', deltas: { cash: 1_000_000, netWorth: 2_500_000, scoreRisk: 30, scoreGoal: 25 }, isRecommended: true },
            { id: 'c2', labelId: 'Sembunyikan riwayat sakit di Unit Link premi tinggi & taruh seluruh uang darurat di aset tak likuid', feedbackId: 'Risiko sengketa klaim plus krisis kas jika musibah mendadak datang.', deltas: { cash: -2_000_000, scoreRisk: -25, scoreSecurity: -20 } },
          ],
        },
        {
          id: 's4_uas_2',
          periodLabelId: 'Bulan 5–8: Rawat Inap Darurat & Perlambatan Pendapatan',
          narrativeId: 'Bulan ke-6 kecelakaan masuk RS (cek klausul plafon kamar inner limit) dan Bulan ke-8 penghasilan sementara turun 30%.',
          choices: [
            { id: 'c1', labelId: 'Pilih kamar sesuai plafon polis agar terhindar excess besar, lengkapi dokumen klaim, & pakai kas darurat likuid secukupnya di Bulan 8', feedbackId: 'Klaim lancar cair sesuai polis & kas rumah tangga tetap aman tanpa utang!', deltas: { emergencyFund: -3_000_000, scoreRisk: 30, scoreCashflow: 25 }, isRecommended: true },
            { id: 'c2', labelId: 'Paksa masuk kamar VIP Rp2,2jt (melebihi inner limit Rp1jt) tanpa cash cadangan lalu berutang pinjol ilegal', feedbackId: 'Gagal Kritis: excess claim menguras uang dan utang ilegal merusak solvabilitas.', deltas: { debt: 5_000_000, scoreSecurity: -40 }, illegalDebtFlag: true },
          ],
        },
        {
          id: 's4_uas_3',
          periodLabelId: 'Bulan 9–12: Mengisi Ulang Darurat & Konsistensi Majemuk',
          narrativeId: 'Pendapatan kembali stabil di kuartal akhir. Bagaimana menutup tahun virtual?',
          choices: [
            { id: 'c1', labelId: 'Pulihkan porsi Dana Darurat terlebih dahulu, lalu lanjutkan setoran compounding rutin tujuan jangka panjang', feedbackId: 'Lulus Semester 4! Siap masuk ke analisis instrumen investasi legal Semester 5.', deltas: { emergencyFund: 3_000_000, netWorth: 4_000_000, scoreGoal: 30, scoreCashflow: 25 }, isRecommended: true },
            { id: 'c2', labelId: 'Foya-foya akhir tahun hingga Dana Darurat kosong dan tanpa investasi jangka panjang', feedbackId: 'Rentan menghadapi krisis tahun depan serta kalah daya beli dari inflasi.', deltas: { cash: -2_500_000, scoreGoal: -20 } },
          ],
        },
      ],
      explanationCard: card({
        why: 'Sinergi antara Dana Darurat likuid, asuransi murni transparan, dan investasi penahan inflasi sesuai horizon menjaga kekayaan nyata keluarga.',
        type: 'dynamic_fact',
        reg: REG_SOURCES.ASURANSI_BPJS,
        next: 'Semester 5 membuka bedah mendalam LPS 3T, Deposito, Emas, SBN Ritel, Reksadana, Saham BEI, & Keuangan Syariah!',
      }),
    }
  ),
};
