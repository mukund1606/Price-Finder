import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import connection from "@/middlewares/dbConnect";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { barcode } = req.query;
  const query = `SELECT master1.code, master1.name, mastersupport.d2 as saleprice, mastersupport.d4 as quantity,
  master1.d2 as mrp, master1.d3 as master1salesprice, master1.d16 as salediscount, mastersupport.d1 as mrpwisemrp, mastersupport.d5 as mrpwisesalesprice
  FROM mastersupport
  INNER JOIN master1
  ON mastersupport.mastercode = master1.code
  WHERE mastersupport.c1 = '${barcode}' and master1.MasterType = 6
  `;
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  } else {
    try {
      connection.query(query).then((result) => {
        // Get by alias
        if (result.length === 0) {
          const query2 = `SELECT code, name, d2 as mrp, d3 as saleprice, d16 as salediscount, alias FROM master1 WHERE alias = '${barcode}' and MasterType = 6`;
          connection.query(query2).then((result2) => {
            const data = {
              barcode: barcode,
              name: result2[0]?.name,
              code: result2[0]?.code,
              saleprice: result2[0]?.saleprice,
              quantity: 1,
              mrp: result2[0]?.mrp,
              salediscount: result2[0]?.salediscount,
            };
            res.json(data);
          });
          return;
        }
        const data = {
          barcode: barcode,
          name: result[0].name,
          code: result[0].code,
          saleprice: result[0].saleprice
            ? result[0].saleprice
            : result[0].master1salesprice,
          quantity: result[0].quantity !== 0 ? result[0].quantity : 1,
          mrp: result[0].mrp,
          salediscount: result[0].salediscount,
        };
        if (result[0].quantity === 0 && result[0].mrpwisemrp !== 0) {
          data.mrp = result[0].mrpwisemrp;
          data.saleprice = result[0].mrpwisesalesprice;
        }
        res.json(data);
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
