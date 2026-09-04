const { CONFIG } = require("./index")

const mySqlPromise = require("mysql2/promise");

const connectionOptions = new URLSearchParams({
  multipleStatements: "true",
  dateStrings: "false",
  waitForConnections: "true",
  connectionLimit: "99",
  enableKeepAlive: "true",
  keepAliveInitialDelay: "10000",
});

if (CONFIG.DATABASE_SSL) {
  connectionOptions.set("ssl", JSON.stringify({ rejectUnauthorized: false }));
}

const pool = mySqlPromise.createPool(
  `${CONFIG.DATABASE_URL}?${connectionOptions.toString()}`
);

console.log(`DB Pool Created.`);

exports.getMySqlPromiseConnection = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error("Pool Connection Error: =======>");
    console.error(error);
    throw error;
  }
};
