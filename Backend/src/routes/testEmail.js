import express from 'express';
import sendEmail from './utils/sendEmail.js';

const router = express.Router();

router.get('/test-email', async (req, res) => {
  await sendEmail({
    to: 'heckerbisleri@gmail.com',
    subject: 'PingWish Test',
    text: 'This is a test email from PingWish 🎉',
  });

  res.send({ message: 'Test email sent' });
});

export default router;