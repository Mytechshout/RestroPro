require("dotenv").config();

const bcrypt = require("bcrypt");
const { getMySqlPromiseConnection } = require("../src/config/mysql.db");

async function createSuperAdmin() {
  const email = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPERADMIN_PASSWORD;
  const name = process.env.SUPERADMIN_NAME?.trim() || "Super Admin";

  if (!email || !password) {
    throw new Error("SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD are required.");
  }

  if (password.length < 10) {
    throw new Error("SUPERADMIN_PASSWORD must contain at least 10 characters.");
  }

  const saltRounds = Number.parseInt(process.env.PASSWORD_SALT, 10) || 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const connection = await getMySqlPromiseConnection();

  try {
    await connection.execute(
      `INSERT INTO superadmins (email, password, name)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE password = VALUES(password), name = VALUES(name)`,
      [email, passwordHash, name]
    );
    console.log(`Super-admin ready: ${email}`);
  } finally {
    connection.release();
  }
}

createSuperAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
