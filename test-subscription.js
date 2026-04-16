import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { User } from "./src/models/user.model.js";

async function testSubscription() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/vidstream`);
        console.log("Connected to DB");

        const users = await User.find().limit(2);
        
        if (users.length < 2) {
            console.log("Not enough users to test subscription.");
            process.exit(1);
        }

        const subscriber = users[0];
        const channel = users[1];

        console.log(`Subscriber: ${subscriber.username} (${subscriber.email})`);
        console.log(`Channel: ${channel.username} (${channel.email})`);

        const accessToken = subscriber.generateAccessToken();

        console.log(`\nMaking API request to subscribe to ${channel._id}...`);
        
        const res = await fetch(`http://localhost:8000/api/v1/subscriptions/toggle/${channel._id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Cookie': `accessToken=${accessToken}` // auth middleware might use cookie or header
            }
        });

        const data = await res.json();
        console.log('API Response Status:', res.status);
        console.log('API Response Data:', data);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

testSubscription();
