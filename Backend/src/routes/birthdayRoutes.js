import express from 'express'
import Birthday from '../models/Birthday.js'

const router = express.Router();

// POST: Add a birthday
router.post('/',async(req,res)=>{
    try{
        const {name,dob,email} = req.body;
        const newEntry = new Birthday({name,dob,email});
        await newEntry.save();
        res.status(201).json({message:'Birthday Saved'});
    }catch(err){
        res.status(500).json({error:'Server error'});
    }
});

// GET: All birthdays (for debugging/testing)
router.get('/',async(req,res)=>{
    try{
        const birthdays = await Birthday.find();
        res.json(birthdays);
    }catch(err){
        res.status(500).json({error:'Server error'});
    }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Birthday.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Birthday not found' });
    res.json({ message: 'Birthday deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Birthday.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});


export default router;