const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

interface UserData {
  region?: string;
  grade?: string;
}

// Get total users, users by region, grade , city, department or any group by property
export const getUsersStats = functions.https.onRequest(async (req:any, res:any) => {
  try {
    const groupBy: string = req.query.groupBy as string || "totalUsers";
    const usersSnapshot = await db.collection("users").get();
    
    if (groupBy === "totalUsers") {
      return res.status(200).json({ totalUsers: usersSnapshot.size });
    }

    const stats: Record<string, number> = {};
    usersSnapshot.forEach((doc:any) => {
      const data = doc.data() as UserData;
      const key = data[groupBy as keyof UserData];
      if (key) {
        stats[key] = (stats[key] || 0) + 1;
      }
    });

    res.status(200).json({ [groupBy]: stats });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
