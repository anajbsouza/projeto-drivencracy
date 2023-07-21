import { db } from "../database/database.config.js";
import { ObjectId } from 'mongodb';
import dayjs from "dayjs";

export async function createChoice (req, res) {

    try {
        let { title, pollId } = req.body;
        console.log('Title:', title, 'Poll ID:', pollId);

        if (!title) return res.sendStatus(422);
        
        const poll = await db.collection("polls").findOne({ _id: new ObjectId (pollId) });
        if (!poll) return res.sendStatus(404);

        const now = dayjs();
        if (dayjs(poll.expireAt).isBefore(now)) return res.sendStatus(403);

        const existingChoice = await db.collection("choices").findOne({ title, pollId });
        if (existingChoice) return res.sendStatus(409);

        await db.collection("choices").insertOne({ title, pollId });
        res.sendStatus(201);

    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function showVote (req, res) {
    try {
        const choiceId = new ObjectId(req.params.id);
        const choice = await db.collection("choices").findOne({ _id: choiceId });

        console.log("ChoiceID:", choiceId)
        console.log("Choice:", choice)

        if (!choice) return res.sendStatus(404);

        const poll = await db.collection("polls").findOne({ _id: new ObjectId(choice.pollId) });

        const now = dayjs();
        if (dayjs(poll.expireAt).isBefore(now)) return res.sendStatus(403);

        await db.collection("votes").insertOne({ choiceId, votedAt: new Date() });
        res.sendStatus(201);

    } catch(err) {
        res.status(500).send(err.message)
    }
}
