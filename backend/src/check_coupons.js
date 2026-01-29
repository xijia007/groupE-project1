
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://zhenjia:Lzj20000501!@cluster0.g6pcvtq.mongodb.net/?appName=Cluster0";
const dbName = "Ecommerce_app"; 

async function checkCoupons() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const coupons = await db.collection("Coupon").find({}).toArray();
    console.log("Available Coupons:");
    console.log(JSON.stringify(coupons, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

checkCoupons();
