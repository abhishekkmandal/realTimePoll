const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote')

const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1219919",
    key: "1833e2f505b82269a00a",
    secret: "c58f6c9ae318b0da3591",
    cluster: "ap2",
    useTLS: true
});

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({ success: true, votes: votes }));
});

router.post('/', (req, res) => {
    const newVote = {
        os: req.body.os,
        points: 1
    };

    new Vote(newVote).save().then(vote => {
        pusher.trigger("realTimePoll", "realTimeVote", {
            points: parseInt(vote.points),
            os: vote.os
        });
        return res.json({ success: true, message: 'Thankyou for voting' });
    });
});
module.exports = router;