import express from 'express'
import Birthday from '../models/Birthday.model.js'
import runScheduler from './utils/scheduler.js'
import auth from "../middleware/auth.js"

const router = express.Router();
router.use(auth);

// POST: Add a birthday
router.post('/',async(req,res)=>{
    try{
        const {name,dob,email} = req.body;
        const newEntry = new Birthday({name,dob,email,user:req.userId});
        await newEntry.save();
        res.status(201).json({message:'Birthday Saved'});
    }catch(err){
        res.status(500).json({error:'Server error'});
    }
});

// GET: All birthdays (for debugging/testing)
router.get('/',async(req,res)=>{
    try{
        const birthdays = await Birthday.find({user:req.userId});
        res.json(birthdays);
    }catch(err){
        res.status(500).json({error:'Server error'});
    }
});

router.delete('/:id', async (req, res) => {
  try {
    const birthday = await Birthday.findOne({_id:req.params.id,user:req.userId});
    if (!birthday) return res.status(404).json({ error: 'Birthday not found' });

    await birthday.deleteOne();
    res.json({ message: 'Birthday deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const birthday = await Birthday.findOne({ _id: req.params.id, user: req.userId });
    if (!birthday) return res.status(404).json({ error: 'Birthday not found' });

    Object.assign(birthday, req.body);
    await birthday.save();
    res.json(birthday);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

router.put('/:id/toggle', async (req, res) => {
  try {
    const birthday = await Birthday.findOne({ _id: req.params.id, user: req.userId });
    if (!birthday) return res.status(404).json({ error: 'Birthday not found' });

    birthday.reminder = !birthday.reminder;
    await birthday.save();
    res.json({ message: 'Reminder toggled', reminder: birthday.reminder });
  } catch (err) {
    res.status(500).json({ error: 'Toggle failed' });
  }
});

router.get('/run-scheduler', async (req, res) => {
  try {
    await runScheduler();
    res.send('✅ Scheduler executed.');
  } catch (err) {
    console.error('❌ Scheduler error:', err.message);
    res.status(500).send('Scheduler failed.');
  }
});

export default router;