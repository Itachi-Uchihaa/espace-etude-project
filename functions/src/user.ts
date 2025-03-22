const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

export const getTotalUsers = functions.https.onRequest(async (req: any, res: any) => {
  try {
    const usersSnapshot = await db.collection("users").get();

    const totalUsers = usersSnapshot.size;

    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
