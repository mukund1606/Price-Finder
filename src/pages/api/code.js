import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import connection from "@/middlewares/dbConnect";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { code } = req.query;
  const query = `SELECT master1.code, master1.name, master1.d2 as mrp, master1.d3 as master1salesprice, mastersupport.d2 as saleprice, mastersupport.d4 as quantity, mastersupport.c1 as barcode, master1.d16 as salediscount, master1.alias, mastersupport.d1 as mrpwisemrp, mastersupport.d5 as mrpwisesalesprice
  FROM master1 LEFT JOIN mastersupport
  ON mastersupport.mastercode = master1.code
  WHERE master1.code = ${code}
  UNION
  SELECT master1.code, master1.name, master1.d2 as mrp, master1.d3 as master1salesprice, NULL as saleprice, NULL as quantity, NULL as barcode, master1.d16 as salediscount, master1.alias, NULL as mrpwisemrp, NULL as mrpwisesalesprice
  FROM master1
  WHERE master1.code = ${code}
  `;
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  } else {
    try {
      connection.query(query).then((result) => {
        if (result.length === 0) {
          return res.status(404).json({ message: "No data found" });
        }
        const data = result.map((item) => {
          const myData = {
            code: item.code,
            name: item.name,
            mrp: item.mrp,
            quantity:
              item.quantity !== null && item.quantity !== 0 ? item.quantity : 1,
            saleprice:
              item.saleprice !== null && item.saleprice !== 0
                ? item.saleprice
                : item.master1salesprice,
            barcode: item.barcode,
            salediscount: item.salediscount,
            alias: item.alias,
          };
          if (item.quantity === 0 && item.mrpwisemrp !== 0) {
            myData.mrp = item.mrpwisemrp;
            myData.saleprice = item.mrpwisesalesprice;
          }
          return myData;
        });
        res.json(data);
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
