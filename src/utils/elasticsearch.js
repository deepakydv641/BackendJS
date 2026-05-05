import { Client } from '@elastic/elasticsearch';

const client = new Client({
    cloud: {
        id: process.env.CLOUD_ID
    },
    auth: {
        apiKey: process.env.ELASTIC_API_KEY
    }
});

export default client;  