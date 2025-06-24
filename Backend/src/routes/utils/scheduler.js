import { addDays, isSameDay } from "date-fns";
import Birthday from "../../models/Birthday.js";
import sendEmail from "./sendEmail.js";

const runScheduler = async () => {
  if (now.getHours() !== 9 || now.getMinutes() !== 0) {
    console.log("⏱ Not 9:00 AM — skipping mail sending.");
    return;
  }

  console.log("⏰ Running birthday scheduler...");

  try {
    const allBirthdays = await Birthday.find();
    const today = new Date();
    const tomorrow = addDays(today, 1);

    for (const entry of allBirthdays) {
      if (!entry.reminder) continue;

      const dob = entry.dob;
      const birthdayThisYear = new Date(
        today.getFullYear(),
        dob.getMonth(),
        dob.getDate()
      );

      const isBirthdayToday = isSameDay(birthdayThisYear, today);
      const isBirthdayTomorrow = isSameDay(birthdayThisYear, tomorrow);

      const alreadySentToday =
        entry.lastSent && isSameDay(entry.lastSent, today);

      if (!alreadySentToday) {
        if (isBirthdayToday) {
          await sendEmail({
            to: entry.email,
            subject: `🎉 It's ${entry.name}'s Birthday Today!`,
            text: `Hey there! Just reminding you — it's ${entry.name}'s birthday today! 🎂`,
          });
          entry.lastSent = today;
          await entry.save();
        } else if (isBirthdayTomorrow) {
          await sendEmail({
            to: entry.email,
            subject: `🎈 Upcoming: ${entry.name}'s Birthday Tomorrow!`,
            text: `Heads up! ${entry.name}'s birthday is tomorrow. Don't forget to wish them! 🎁`,
          });
          entry.lastSent = today;
          await entry.save();
        }
      }
    }
  } catch (err) {
    console.error("Error in scheduler:", err.message);
  }
};

// export default runScheduler so it can be called manually or scheduled externally
export default runScheduler;