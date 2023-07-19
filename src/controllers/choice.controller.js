import { db } from "../database/database.config.js";
import { ObjectId } from 'mongodb';
import dayjs from "dayjs";

export async function createChoice (req, res) {

    try {
        let { title, pollId } = req.body;

        if (!title) return res.sendStatus(422);
        
        const poll = await db.collection("polls").findOne({ _id: pollId });
        if (!poll) return res.sendStatus(404);

        const now = dayjs();
        if (dayjs(poll.expireAt).isBefore(now)) return res.sendStatus(403);

        const existingChoice = await db.collection("choices").findOne({ title, pollId });
        if (existingChoice) return res.status(409);

        await db.collection("choices").insertOne({ title, pollId });
        res.sendStatus(201)

    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function showVote (req, res) {
    try {

    } catch(err) {
        res.status(500).send(err.message)
    }
}