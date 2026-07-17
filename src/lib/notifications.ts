import { LocalNotifications } from '@capacitor/local-notifications';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export interface NotificationTemplate {
  titleId: string;
  bodyId: string;
  titleEn: string;
  bodyEn: string;
}

// 1. Panic Notifications (Triggered 1-2 hours before midnight)
const PANIC_BANK: NotificationTemplate[] = [
  {
    titleId: "🚨 SEBENTAR LAGI HANGUS!",
    bodyId: "Waktu tersisa kurang dari 1 jam! Ayo selamatkan streak-mu sekarang juga!",
    titleEn: "🚨 ABOUT TO BURN!",
    bodyEn: "Less than 1 hour left! Save your streak right now!"
  },
  {
    titleId: "Dompetmu menipis nih! 😱",
    bodyId: "Yakin mau tidur sebelum cek KoinKita? Tinggal main 1 menit kok!",
    titleEn: "Wallet is getting thin! 😱",
    bodyEn: "Are you sure you want to sleep before checking KoinKita? Just play for 1 minute!"
  },
  {
    titleId: "Sultan kok jam segini belum online? 👑",
    bodyId: "Nanti keburu anjlok loh asetnya! Ayo login sebentar buat amankan posisi.",
    titleEn: "Why isn't the Sultan online yet? 👑",
    bodyEn: "Your assets might crash! Login briefly to secure your position."
  },
  {
    titleId: "⚠️ STATUS DARURAT ⚠️",
    bodyId: "Streak-mu di ujung tanduk! Jangan biarkan usahamu berhari-hari sia-sia!",
    titleEn: "⚠️ EMERGENCY STATUS ⚠️",
    bodyEn: "Your streak is on the edge! Don't let your hard work go to waste!"
  },
  {
    titleId: "Tinggal beberapa menit lagi! ⏳",
    bodyId: "Buktikan kalau kamu konsisten! Buka KoinKita sekarang!",
    titleEn: "Just a few minutes left! ⏳",
    bodyEn: "Prove that you are consistent! Open KoinKita now!"
  }
];

// 2. Guilt-Trip Notifications (Triggered at 00:01 if missed)
const GUILT_BANK: NotificationTemplate[] = [
  {
    titleId: "Streak-mu resmi hangus. 🥀",
    bodyId: "Pupus sudah harapan jadi miliarder... Yaudah deh, kayaknya kamu emang lebih suka nabung di celengan ayam beneran.",
    titleEn: "Your streak is officially gone. 🥀",
    bodyEn: "The hope of becoming a billionaire is gone... Well, maybe you prefer saving in a real piggy bank."
  },
  {
    titleId: "Kamu tega ya... 💔",
    bodyId: "Ngebiarin investasi kita di Pohon Aset terbengkalai sendirian di tengah malam.",
    titleEn: "How could you... 💔",
    bodyEn: "Leaving our investment in the Asset Tree abandoned alone at midnight."
  },
  {
    titleId: "Kecewa sih, tapi mau gimana lagi. 😔",
    bodyId: "Semua usahamu kemarin kembali ke nol. Selamat mengulang dari awal besok.",
    titleEn: "Disappointed, but what can we do. 😔",
    bodyEn: "All your efforts yesterday returned to zero. Good luck starting over tomorrow."
  },
  {
    titleId: "Selamat tinggal Streak 🔥",
    bodyId: "Api semangatmu sudah padam. Kalau sudah siap bangkit, kami tunggu di sini.",
    titleEn: "Goodbye Streak 🔥",
    bodyEn: "Your fire of enthusiasm has gone out. When you're ready to rise, we'll be waiting here."
  },
  {
    titleId: "Oh... jadi gini akhirnya? 📉",
    bodyId: "Portofolio dibiarkan merah begitu saja. Sungguh keputusan yang mengejutkan dari seorang master.",
    titleEn: "Oh... so this is how it ends? 📉",
    bodyEn: "Portfolio left in the red just like that. A truly shocking decision from a master."
  }
];

// 3. Fake Social / Pseudo-Social Ping (Triggered Day + 1 or Day + 2)
const SOCIAL_BANK = [
  {
    titleId: "[NAME] baru aja nyalip skor kamu! 🏆",
    bodyId: "Masa mau diam aja ngeliat dia pamer di Arena?",
    titleEn: "[NAME] just overtook your score! 🏆",
    bodyEn: "Are you just going to sit there watching them show off in the Arena?"
  },
  {
    titleId: "Psst... [NAME] lagi mantau profilmu tuh 👀",
    bodyId: "Yuk unjuk gigi beli aset baru biar dia makin iri!",
    titleEn: "Psst... [NAME] is monitoring your profile 👀",
    bodyEn: "Let's show off by buying new assets to make them more jealous!"
  },
  {
    titleId: "[NAME] nanyain kamu nih 🗣️",
    bodyId: "'Kok ilang dari papan peringkat Arena ya?' - Gitu katanya. Buktikan kamu belum menyerah!",
    titleEn: "[NAME] is asking about you 🗣️",
    bodyEn: "'Why are they missing from the Arena leaderboard?' - Prove you haven't given up!"
  },
  {
    titleId: "[NAME] lagi push rank kenceng banget! 🚀",
    bodyId: "Jangan biarkan temanmu sukses sendirian. Susul dia sekarang di KoinKita!",
    titleEn: "[NAME] is pushing rank really hard! 🚀",
    bodyEn: "Don't let your friend succeed alone. Catch up with them now in KoinKita!"
  },
  {
    titleId: "Ada pesan rahasia dari [NAME]... 🤫",
    bodyId: "Bercanda deng! Tapi dia emang lagi main KoinKita, mending kamu login juga deh.",
    titleEn: "Secret message from [NAME]... 🤫",
    bodyEn: "Just kidding! But they are actually playing KoinKita, you better log in too."
  }
];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export const setupNotificationChannels = async () => {
  try {
    const hasPerm = await LocalNotifications.checkPermissions();
    if (hasPerm.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }
    
    // Create channel for Android
    await LocalNotifications.createChannel({
      id: 'koinkita-panic',
      name: 'KoinKita Alerts',
      description: 'Crucial game reminders',
      importance: 5,
      visibility: 1
    });
  } catch (e) {
    console.error("LocalNotifs Setup Error", e);
  }
};

export const cancelAllScheduledNotifications = async () => {
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
      console.log("Canceled all pending local notifications.");
    }
  } catch (e) {
    console.error("Error canceling notifications", e);
  }
};

export const schedulePanicNotifications = async (language: string, uid: string) => {
  try {
    await cancelAllScheduledNotifications();

    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Next midnight
    
    // Calculate time until midnight
    const msUntilMidnight = midnight.getTime() - now.getTime();
    
    // If it's already past 23:00, we might skip the 23:00 alarm, so check explicitly.
    const notificationsToSchedule = [];
    
    // 1. Panic Alarm (1 hour before midnight - 23:00)
    const panicTime = new Date(midnight.getTime() - (60 * 60 * 1000));
    if (panicTime > now) {
      const panicMsg = getRandom(PANIC_BANK) as NotificationTemplate;
      notificationsToSchedule.push({
        id: 1,
        title: language === 'id' ? panicMsg.titleId : panicMsg.titleEn,
        body: language === 'id' ? panicMsg.bodyId : panicMsg.bodyEn,
        schedule: { at: panicTime },
        channelId: 'koinkita-panic',
      });
    }

    // 2. Extreme Panic Alarm (15 mins before midnight - 23:45)
    const extremeTime = new Date(midnight.getTime() - (15 * 60 * 1000));
    if (extremeTime > now) {
      notificationsToSchedule.push({
        id: 2,
        title: language === 'id' ? "🚨 15 MENIT LAGI! 🚨" : "🚨 15 MINUTES LEFT! 🚨",
        body: language === 'id' ? "Kesempatan terakhirmu menyelamatkan streak!" : "Your last chance to save the streak!",
        schedule: { at: extremeTime },
        channelId: 'koinkita-panic',
      });
    }

    // 3. Guilt-Trip Alarm (00:01 next day)
    const guiltTime = new Date(midnight.getTime() + (1 * 60 * 1000));
    if (guiltTime > now) {
      const guiltMsg = getRandom(GUILT_BANK) as NotificationTemplate;
      notificationsToSchedule.push({
        id: 3,
        title: language === 'id' ? guiltMsg.titleId : guiltMsg.titleEn,
        body: language === 'id' ? guiltMsg.bodyId : guiltMsg.bodyEn,
        schedule: { at: guiltTime },
        channelId: 'koinkita-panic',
      });
    }

    // 4. Fake Social Ping (Random time within the day)
    const randomHours = Math.floor(Math.random() * 8) + 2; // 2 to 10 hours before midnight
    const hasFakeSocial = Math.random() > 0.5;

    if (hasFakeSocial) {
      const socialTime = new Date(midnight.getTime() - (randomHours * 60 * 60 * 1000));
      // Fetch a random friend name (fallback to a generic name if no friends)
      let friendName = "Budi";
      try {
        const friendsRef = collection(db, 'users', uid, 'friends');
        const snap = await getDocs(friendsRef);
        if (!snap.empty) {
          const friendDocs = snap.docs.map(d => d.data());
          if (friendDocs.length > 0) {
            const randomFriend = friendDocs[Math.floor(Math.random() * friendDocs.length)];
            friendName = randomFriend.name || "Budi";
          }
        }
      } catch (e) {
        console.error("Error fetching friend for notification", e);
      }

      const socialMsgTemplate = getRandom(SOCIAL_BANK);
      const sTitleId = socialMsgTemplate.titleId.replace("[NAME]", friendName);
      const sBodyId = socialMsgTemplate.bodyId.replace("[NAME]", friendName);
      const sTitleEn = socialMsgTemplate.titleEn.replace("[NAME]", friendName);
      const sBodyEn = socialMsgTemplate.bodyEn.replace("[NAME]", friendName);
      
      notificationsToSchedule.push({
        id: 4,
        title: language === 'id' ? sTitleId : sTitleEn,
        body: language === 'id' ? sBodyId : sBodyEn,
        schedule: { at: socialTime },
        channelId: 'koinkita-panic',
      });
    }

    if (notificationsToSchedule.length > 0) {
      await LocalNotifications.schedule({ notifications: notificationsToSchedule });
      console.log("Scheduled", notificationsToSchedule.length, "panic notifications.");
    }
  } catch (e) {
    console.error("Failed to schedule panic notifications", e);
  }
};
