import { db } from "../database/database.config.js";
import duration from 'dayjs/plugin/duration.js';
import { ObjectId } from 'mongodb';
import dayjs from "dayjs";

dayjs.extend(duration);

export async function createPoll(req, res) {
    let { title, expireAt } = req.body;
    title = title.trim();

    try {
        if(!title) return res.sendStatus(422);
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

export async function showResult(req, res) {
    const pollId = req.params.id;
    try {
        const poll = await db.collection("polls").findOne({ _id: new ObjectId(pollId) });
        if (!poll) return res.sendStatus(404);

        const choices = await db.collection("choices").find({ pollId }).toArray();

        let result = null;
        let maxVotes = 0;

        for (let choice of choices) {
            const votesCount = await db.collection("votes").countDocuments({ choiceId: choice._id });

            if (votesCount > maxVotes) {
                maxVotes = votesCount;
                result = {
                    title: choice.title,
                    votes: votesCount
                };
            }
        }

        res.status(200).send({poll, result});

    } catch(err) {
        res.status(500).send(err.message)
    }
}
