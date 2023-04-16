import ADODB from "node-adodb";

const connection = ADODB.open(process.env.DATABASE_URI, process.env.IS_64_BIT);

export default connection;
