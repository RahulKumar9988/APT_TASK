const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

// 1. Create an event
router.post('/events', async (req, res) => {
    const db = req.db;
    const { uid, name, tagline, schedule, description, moderator, category, sub_category, rigor_rank, attendees } = req.body;

    const newEvent = {
        uid: parseInt(uid),
        name,
        tagline,
        schedule: new Date(schedule),
        description,
        moderator,
        category,
        sub_category,
        rigor_rank: parseInt(rigor_rank),
        attendees: attendees ? JSON.parse(attendees) : [],
    };

    try {
        const result = await db.collection('events').insertOne(newEvent);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create event', details: err });
    }
});

// 2. Fetch all events with pagination
router.get('/events', async (req, res) => {
    const db = req.db;
    const { page = 1, limit = 5 } = req.query;

    try {
        const events = await db
            .collection('events')
            .find({})
            .sort({ schedule: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .toArray();

        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch events', details: err });
    }
});

// 3. Fetch a specific event by ID
router.get('/events/:id', async (req, res) => {
    const db = req.db;
    const { id } = req.params;

    try {
        const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch event', details: err });
    }
});

// 4. Delete an event by ID
router.delete('/events/:id', async (req, res) => {
    const db = req.db;
    const { id } = req.params;

    try {
        const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.send('Event deleted successfully');
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event', details: err });
    }
});

module.exports = router;
