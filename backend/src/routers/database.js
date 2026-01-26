import {MongoClient} from 'mongodb';
import config from '../config.js';

const client = new MongoClient(config.MONGO_URI);

client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });
const db = client.db('Ecommerce_app');

export default db;