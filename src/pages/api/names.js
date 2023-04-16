import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import connection from "@/middlewares/dbConnect";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const query = "SELECT code, name, alias FROM master1 where mastertype = 6";
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  } else {
    try {
      connection.query(query).then((result) => {
        res.json(result);
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
