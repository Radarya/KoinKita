export type Language = 'id' | 'en';

export interface GuideRuleItem {
  title: string;
  desc: string;
}

export const translations = {
  id: {
    welcomeNew: "Selamat Datang",
    welcomeBack: "Selamat Datang Kembali",
    ready: "Siap melanjutkan ekspedisi literasi finansial hari ini?",
    myProfile: "Profilku",
    leaderboard: "Papan Peringkat",
    totalCoins: "Total Koin",
    rules: "Aturan Main",
    logout: "Keluar",
    playRole: "Ekspedisi",
    tosTitle: "Cara Bermain & Aturan",
    tosIntro: "Selamat datang di KoinKita (CIKO)! Panduan dan ketentuan berikut mengatur penggunaan seluruh fitur belajar, kuis, dan simulasi edukasi di platform CIKO.",
    guideTitle: "Cara Bermain & Aturan Nyawa",
    guideSteps: [
      {
        title: "1. Ekspedisi Kurikulum & Buku Saku",
        desc: "Belajar terstruktur melalui 6 Semester, 31 Unit, dan 175 Keping Materi bertahap. Gunakan Buku Saku di tiap unit sebagai ringkasan konsep dan rujukan regulasi OJK, Bank Indonesia, serta peraturan resmi."
      },
      {
        title: "2. Sistem 5 Nyawa Per Kesalahan",
        desc: "Setiap kesalahan menjawab di jalur Ekspedisi utama mengurangi 1 Nyawa dari total 5 Nyawa dan otomatis menyimpan soal tersebut ke Bank Kesalahan."
      },
      {
        title: "3. Tebus Nyawa di Menu Latihan",
        desc: "Saat nyawa berkurang atau habis, buka menu Latihan di bar navigasi untuk menebus +1 Nyawa gratis lewat Tebus Kesalahan Ekspedisi atau Flashcard Konsep. Penebusan gratis dibatasi maksimal 2× per hari agar waktu layar tetap sehat, atau gunakan 50 Koin Saku dan dukungan teman di Sosial."
      },
      {
        title: "4. Tes Penempatan Bersama & Ujian Semester",
        desc: "Kamu dapat mengikuti Tes Penempatan Bersama 1× kesempatan sebelum menempuh semester awal untuk memetakan tingkat kemampuan langsung hingga Semester 4. Setiap semester juga dilengkapi ujian UTS, UAS, dan Uji Kompetensi Lompat Pos."
      },
      {
        title: "5. Akun Tamu & Sinkronisasi Progres",
        desc: "Akun Tamu tersimpan di perangkat ini dan akan hilang jika aplikasi dihapus. Akun Tamu yang tidak aktif selama 30 hari dapat dibersihkan otomatis. Tautkan akun ke Google atau Email kapan saja di menu Profil atau Pengaturan agar progresmu tersimpan aman di cloud."
      }
    ] as GuideRuleItem[],
    tosRegisterTitle: "Pendaftaran, Akun & Tamu",
    tosRegisterDesc: "Pengguna dapat belajar langsung sebagai Tamu atau menautkan akun ke Google maupun Email. Data akun Tamu terikat pada perangkat serta memiliki masa retensi 30 hari tanpa aktivitas sebelum dibersihkan otomatis. Tautkan akun agar progres bertahan permanen saat berganti perangkat atau menghapus aplikasi.",
    tosCoinsTitle: "Koin Saku, Klub & Liga Mingguan",
    tosCoinsDesc: "Koin Saku, Nyawa, XP Liga, dan seluruh aset virtual di dalam CIKO murni digunakan untuk simulasi belajar dan penebusan Nyawa atau kosmetik avatar. Aset ini tidak bernilai uang nyata dan tidak dapat diuangkan. Promosi dan degradasi Liga Mingguan ditentukan dari XP mingguan yang di-reset berkala.",
    tosFairPlayTitle: "Integritas & Fair Play",
    tosFairPlayDesc: "Setiap pemain wajib menjaga sportivitas. Eksploitasi celah sistem, bot, manipulasi skrip, maupun manipulasi papan peringkat dapat dikenakan sanksi pembekuan atau penghapusan skor tanpa pemberitahuan.",
    tosDisclaimerTitle: "DISCLAIMER EDUKASI FINANSIAL",
    tosDisclaimerDesc: "Seluruh skenario anggaran, instrumen investasi, dan simulasi dalam CIKO disusun untuk tujuan edukasi literasi finansial. CIKO bukan Penasihat Keuangan berizin; keputusan keuangan di dunia nyata sepenuhnya menjadi tanggung jawab pribadi pengguna.",
    tosDevTitle: "Hak Pengembang & Hak Cipta",
    tosDevDesc: "Hak Cipta © 2026 Radithya Aydin Aryasatya. Pengembang berhak memperbarui kurikulum, menyesuaikan poin, batas tebus harian, atau sistem liga untuk menjaga kestabilan dan kualitas ekosistem belajar CIKO.",
    tosUnderstand: "Saya Mengerti",
    privacyBanner: "Keamanan data pribadimu adalah prioritas utama. CIKO tidak menjual atau membagikan data pribadi pengguna ke pihak ketiga maupun pelacak iklan.",
    privacySec1Title: "1. Otentikasi & Data Profil",
    privacySec1Desc: "Kami hanya menyimpan metadata dasar yang diperlukan untuk Firebase Authentication dan profil belajarmu, seperti nama tampilan, nama pengguna, email, dan statistik progres.",
    privacySec2Title: "2. Penyimpanan Progres & Akun Tamu",
    privacySec2Desc: "Progres Ekspedisi, Bank Kesalahan, koin, dan riwayat latihan tersimpan aman pada Google Firestore terikat UID akunmu. Akun Tamu yang tidak aktif lebih dari 30 hari atau ditinggalkan tanpa progres dapat dihapus otomatis untuk menjaga efisiensi server.",
    privacySec3Title: "3. Hak Kepemilikan & Penghapusan Data",
    privacySec3Desc: "Kamu memegang kendali penuh untuk menautkan akun Tamu ke Google/Email atau menghapus akun beserta seluruh riwayat progres secara permanen kapan saja lewat menu Pengaturan.",
    settingsTitle: "Pengaturan",
    languageLabel: "Bahasa Aplikasi",
    bgmLabel: "Musik Latar Belakang",
    on: "Aktif",
    off: "Mati",
    close: "Tutup",
    levelUpTitle: "Naik Level!",
    levelUpDesc: "Selamat! Kamu naik ke Level {newLevel}!",
    tutorialTitle: "Panduan Bermain",
    startGame: "Mulai"
  },
  en: {
    welcomeNew: "Welcome",
    welcomeBack: "Welcome Back",
    ready: "Ready for today's financial literacy expedition?",
    myProfile: "My Profile",
    leaderboard: "Leaderboard",
    totalCoins: "Total Coins",
    rules: "Rules of Play",
    logout: "Sign Out",
    playRole: "Expedition",
    tosTitle: "How to Play & Rules",
    tosIntro: "Welcome to KoinKita (CIKO)! These guidelines and terms govern your use of all learning paths, quizzes, and educational simulations on CIKO.",
    guideTitle: "How to Play & Heart Rules",
    guideSteps: [
      {
        title: "1. Curriculum Expedition & Guidebook",
        desc: "Learn step by step across 6 Semesters, 31 Units, and 175 Paths. Check each unit's Guidebook for concise formulas and official regulatory references."
      },
      {
        title: "2. Five-Heart System Per Mistake",
        desc: "Each mistake on a core Expedition Path deducts 1 Heart out of 5 and automatically saves that missed item into your Mistake Bank."
      },
      {
        title: "3. Recover Hearts in Practice",
        desc: "When hearts are low or empty, open Practice from the navigation bar to recover +1 Heart free via Expedition Mistake Review or Concept Flashcards up to 2× daily, or spend 50 Coins and request hearts from friends in Social."
      },
      {
        title: "4. Joint Placement Test (TPB) & Exams",
        desc: "New learners can take the one-shot Joint Placement Test to place up to Semester 4. Each semester also features timed Midterms, Finals, and Stage Skip exams."
      },
      {
        title: "5. Guest Accounts & Cloud Sync",
        desc: "Guest progress stays tied to this device and is lost if the app is uninstalled. Inactive Guest accounts over 30 days old may be purged automatically. Link Google or Email anytime in Profile or Settings to back up progress safely."
      }
    ] as GuideRuleItem[],
    tosRegisterTitle: "Accounts & Guest Retention",
    tosRegisterDesc: "You can start immediately as a Guest or link a Google or Email account. Guest profiles live on your device with a 30-day inactivity expiry before cleanup. Link an account to preserve progress across reinstalls or devices.",
    tosCoinsTitle: "Coins, Clubs & Weekly Leagues",
    tosCoinsDesc: "Pocket Coins, Hearts, League XP, and virtual items inside CIKO are strictly educational simulation metrics with no real-world monetary value. Weekly Arena promotions and demotions follow weekly XP resets.",
    tosFairPlayTitle: "Integrity & Fair Play",
    tosFairPlayDesc: "All learners must play fairly. Exploiting bugs, automation scripts, or leaderboard tampering may result in score resets or account suspension without notice.",
    tosDisclaimerTitle: "EDUCATIONAL FINANCIAL DISCLAIMER",
    tosDisclaimerDesc: "All budgeting, investing, and regulatory scenarios in CIKO are educational simplifications. CIKO does not provide licensed financial advice; real-world financial decisions remain solely your responsibility.",
    tosDevTitle: "Developer & Copyright Rights",
    tosDevDesc: "Copyright © 2026 Radithya Aydin Aryasatya. Developers may adjust curriculum balance, coin rewards, daily heart limits, or league structures to maintain a healthy learning ecosystem.",
    tosUnderstand: "I Understand",
    privacyBanner: "Protecting your personal data is our core priority. CIKO does not sell user data or embed third-party ad trackers.",
    privacySec1Title: "1. Authentication & Profile Data",
    privacySec1Desc: "We store only essential metadata required by Firebase Authentication and your learning profile, such as display name, username, email, and learning statistics.",
    privacySec2Title: "2. Progress Storage & Guest Cleanup",
    privacySec2Desc: "Expedition progress, Mistake Bank items, coins, and activity logs are stored securely in Google Firestore tied to your account UID. Inactive Guest accounts past 30 days or empty abandoned sessions may be removed automatically.",
    privacySec3Title: "3. Data Ownership & Deletion Rights",
    privacySec3Desc: "You remain in full control to upgrade a Guest account to Google/Email or permanently delete your account and all data anytime from Settings.",
    settingsTitle: "Settings",
    languageLabel: "App Language",
    bgmLabel: "Background Music",
    on: "On",
    off: "Off",
    close: "Close",
    levelUpTitle: "Level Up!",
    levelUpDesc: "Congratulations! You reached Level {newLevel}!",
    tutorialTitle: "How to Play",
    startGame: "Start"
  }
};
