import cron from 'node-cron';
import {addDays,isSameDay} from 'date-fns'

import Birthday from '../../models/Birthday.js'
import sendEmail from './sendEmail.js'

const runScheduler = async () => {
  console.log('⏰ Running birthday scheduler...');

  try {
    const allBirthdays = await Birthday.find();

    const today = new Date();
    const tomorrow = addDays(today, 1);

    for (const entry of allBirthdays) {
      const dob = entry.dob; // Format: 'YYYY-MM-DD'
      const birthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

      if (entry.reminder && isSameDay(birthdayThisYear, today)) {
        await sendEmail({
          to: entry.email,
          subject: `🎉 It's ${entry.name}'s Birthday Today!`,
          text: `Hey there! Just reminding you — it's ${entry.name}'s birthday today! 🎂`,
        });
      } else if (entry.reminder && isSameDay(birthdayThisYear, tomorrow)) {
        await sendEmail({
          to: entry.email,
          subject: `🎈 Upcoming: ${entry.name}'s Birthday Tomorrow!`,
          text: `Heads up! ${entry.name}'s birthday is tomorrow. Don't forget to wish them! 🎁`,
        });
      }
    }
  } catch (err) {
    console.error('Error in scheduler:', err.message);
  }
};

// ✅ Schedule to run every day at 00:00 (midnight)
// cron.schedule('0 9 * * *', runScheduler);

export default runScheduler;