import { db } from "../database/database.config.js";
import duration from 'dayjs/plugin/duration.js';
import { ObjectId } from 'mongodb';
import dayjs from "dayjs";

dayjs.extend(duration);

export async function createPoll(req, res) {
    let { title, expireAt } = req.body;

    try {
        if(!expireAt) {
            expireAt = dayjs().add(dayjs.duration(30, 'day')).format('YYYY-MM-DD HH:mm');
        }
        await db.collection("polls").insertOne({ title, expireAt })
        res.sendStatus(201);
    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function returnPoll(req, res) {
    try {
        const polls = await db.collection("polls").find().toArray();
        console.log(polls);
        res.send(polls);
    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function voteOptions(req, res) {
    try {
        const pollId = req.params.id;
        
        const poll = await db.collection("polls").findOne({ _id: new ObjectId(pollId) });
        if (!poll) return res.sendStatus(404);

        const choices = await db.collection("choices").find({ pollId }).toArray();
        res.send(choices);
    } catch(err) {
        res.status(500).send(err.message);
    }
}
