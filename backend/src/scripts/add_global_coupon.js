
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://zhenjia:Lzj20000501!@cluster0.g6pcvtq.mongodb.net/?appName=Cluster0";
const dbName = "Ecommerce_app"; 

async function addGlobalCoupon() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    
    const couponCode = "GLOBAL2026";
    
    // Check if exists
    const existing = await db.collection("Coupon").findOne({ code: couponCode });
    if (existing) {
        console.log(`Coupon ${couponCode} already exists.`);
        return;
    }

    const newCoupon = {
        code: couponCode,
        discountPercentage: 25, // 25% off
        expirationDate: new Date("2026-12-31T23:59:59Z"),
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await db.collection("Coupon").insertOne(newCoupon);
    console.log(`Global Coupon ${couponCode} created successfully!`);
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

addGlobalCoupon();
