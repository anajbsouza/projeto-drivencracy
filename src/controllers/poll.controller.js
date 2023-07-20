import { db } from "../database/database.config.js";
import duration from 'dayjs/plugin/duration.js';
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
        
    } catch(err) {
        res.status(500).send(err.message)
    }
}