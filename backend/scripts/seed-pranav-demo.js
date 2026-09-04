const { getMySqlPromiseConnection } = require("../src/config/mysql.db");

const username = process.argv[2] || "admin@pranav.com";

const inventorySeed = [
  ["Cake sponge slices", 120, "pc", 20],
  ["500 g cake bases", 12, "pc", 3],
  ["Whipping cream", 15, "kg", 3],
  ["Chocolate and flavour mix", 8, "kg", 1],
  ["Fresh fruits", 30, "kg", 6],
  ["Milk", 40, "l", 8],
  ["Curd", 20, "l", 4],
  ["Sugar", 25, "kg", 5],
  ["Ice cream", 12, "kg", 2],
  ["Fruit and flavour syrup", 15, "l", 3],
  ["Coffee powder", 4, "kg", 1],
  ["Nannari syrup", 10, "l", 2],
  ["Lemon", 15, "kg", 3],
  ["Mint leaves", 5, "kg", 1],
  ["Soda bottles", 80, "pc", 15],
  ["Brownie stock", 40, "pc", 8],
  ["Choco lava stock", 40, "pc", 8],
  ["Honey cake stock", 40, "pc", 8],
];

const menuSeed = [
  ["Pastries", "Butterscotch Pastry", "Soft vanilla sponge layered with butterscotch cream and caramel crunch.", 80, [["Cake sponge slices", 1], ["Whipping cream", 0.03], ["Chocolate and flavour mix", 0.01]]],
  ["Pastries", "Black Forest Pastry", "Chocolate sponge with whipped cream and cherries.", 85, [["Cake sponge slices", 1], ["Whipping cream", 0.03], ["Chocolate and flavour mix", 0.01]]],
  ["Pastries", "White Forest Pastry", "White sponge cake layered with cream and pineapple bits.", 85, [["Cake sponge slices", 1], ["Whipping cream", 0.03], ["Fruit and flavour syrup", 0.01]]],
  ["Pastries", "Choco Truffle Pastry", "Rich chocolate pastry filled with thick truffle cream.", 95, [["Cake sponge slices", 1], ["Whipping cream", 0.03], ["Chocolate and flavour mix", 0.02]]],
  ["Pastries", "Strawberry Pastry", "Strawberry-flavoured sponge with whipped cream.", 85, [["Cake sponge slices", 1], ["Whipping cream", 0.03], ["Fruit and flavour syrup", 0.01]]],
  ["Pastries", "Mango Pastry", "Mango-flavoured sponge cake layered with mango cream.", 85, [["Cake sponge slices", 1], ["Whipping cream", 0.03], ["Fruit and flavour syrup", 0.01]]],
  ["Pastries", "Blueberry Pastry", "Vanilla sponge layered with blueberry cream and topping.", 90, [["Cake sponge slices", 1], ["Whipping cream", 0.03], ["Fruit and flavour syrup", 0.01]]],
  ["Pastries", "Black Forest Cake [500 g]", "Fresh cream cake.", 550, [["500 g cake bases", 1], ["Whipping cream", 0.2], ["Chocolate and flavour mix", 0.08]]],

  ["Drinks (Beverages)", "Lime Juice [250 ml]", "Refreshing lime juice blended with sugar and salt.", 50, [["Lemon", 0.08], ["Sugar", 0.02]]],
  ["Drinks (Beverages)", "Apple Juice [250 ml]", "Sweet and crisp fresh apple juice.", 90, [["Fresh fruits", 0.25], ["Sugar", 0.01]]],
  ["Drinks (Beverages)", "Mosambi Juice [250 ml]", "Light and tangy seasonal sweet lime juice.", 80, [["Fresh fruits", 0.25], ["Sugar", 0.01]]],
  ["Drinks (Beverages)", "Orange Juice [250 ml]", "Fresh orange juice.", 80, [["Fresh fruits", 0.25], ["Sugar", 0.01]]],
  ["Drinks (Beverages)", "Pineapple Juice [250 ml]", "Fresh pineapple juice.", 80, [["Fresh fruits", 0.25], ["Sugar", 0.01]]],
  ["Drinks (Beverages)", "Pomegranate Juice [250 ml]", "Fresh pomegranate juice.", 100, [["Fresh fruits", 0.25], ["Sugar", 0.01]]],
  ["Drinks (Beverages)", "Muskmelon Juice [250 ml]", "Cool fresh muskmelon juice.", 70, [["Fresh fruits", 0.25], ["Sugar", 0.01]]],
  ["Drinks (Beverages)", "Watermelon Juice [250 ml]", "Hydrating fresh watermelon juice.", 60, [["Fresh fruits", 0.25], ["Sugar", 0.01]]],

  ...["Vanilla", "Butterscotch", "Pineapple", "Strawberry", "Mango", "Oreo", "Chocolate"].map((flavour, index) => [
    "Drinks (Beverages)",
    `${flavour} Milkshake [250 ml]`,
    `Thick and chilled ${flavour.toLowerCase()} milkshake.`,
    [90, 110, 100, 100, 110, 120, 120][index],
    [["Milk", 0.2], ["Ice cream", 0.05], ["Fruit and flavour syrup", 0.02]],
  ]),
  ["Drinks (Beverages)", "Cold Coffee [250 ml]", "Smooth chilled coffee shake.", 100, [["Milk", 0.2], ["Coffee powder", 0.01], ["Sugar", 0.02]]],
  ["Drinks (Beverages)", "Badam Milk [250 ml]", "Almond-flavoured milk with cardamom.", 80, [["Milk", 0.2], ["Fruit and flavour syrup", 0.02]]],
  ["Drinks (Beverages)", "Rose Milk [250 ml]", "Chilled milk flavoured with rose syrup.", 70, [["Milk", 0.2], ["Fruit and flavour syrup", 0.02]]],
  ["Drinks (Beverages)", "Sarbath [250 ml]", "Traditional Nannari syrup drink.", 50, [["Nannari syrup", 0.03], ["Sugar", 0.01]]],
  ["Drinks (Beverages)", "Soda Sarbath [250 ml]", "Nannari sarbath mixed with soda.", 60, [["Nannari syrup", 0.03], ["Soda bottles", 1]]],
  ["Drinks (Beverages)", "Lemon Sarbath [250 ml]", "Nannari sarbath with fresh lemon.", 60, [["Nannari syrup", 0.03], ["Lemon", 0.03]]],
  ["Drinks (Beverages)", "Masala Sarbath [250 ml]", "Lemon sarbath with a special masala mix.", 70, [["Nannari syrup", 0.03], ["Lemon", 0.03]]],
  ["Drinks (Beverages)", "Mint Lemon Soda [250 ml]", "Soda with lemon juice and mint leaves.", 70, [["Soda bottles", 1], ["Lemon", 0.03], ["Mint leaves", 0.01]]],

  ...["Virgin Mojito", "Lemon Mint Mojito", "Blue Curacao Mojito", "Chilli Mojito", "Cotton Candy Mojito"].map((title, index) => [
    "Drinks (Beverages)",
    `${title} [250 ml]`,
    `${title} with lemon, mint and soda. Non-alcoholic.`,
    [90, 90, 110, 100, 110][index],
    [["Soda bottles", 1], ["Lemon", 0.03], ["Mint leaves", 0.01], ["Fruit and flavour syrup", 0.02]],
  ]),

  ...["Plain", "Choco", "Strawberry", "Pineapple", "Mango"].map((flavour, index) => [
    "Drinks (Beverages)",
    `${flavour} Lassi [250 ml]`,
    `${flavour} lassi made with chilled curd.`,
    [70, 90, 90, 90, 100][index],
    [["Curd", 0.2], ["Sugar", 0.02], ...(flavour === "Plain" ? [] : [["Fruit and flavour syrup", 0.02]])],
  ]),

  ["Desserts", "Brownie", "Chocolate brownie.", 80, [["Brownie stock", 1]]],
  ["Desserts", "Choco Lava", "Warm chocolate lava cake.", 90, [["Choco lava stock", 1]]],
  ["Desserts", "Honey Cake", "Soft honey cake.", 70, [["Honey cake stock", 1]]],
];

async function upsertCategory(conn, tenantId, title) {
  const [rows] = await conn.query("SELECT id FROM categories WHERE tenant_id = ? AND title = ? LIMIT 1", [tenantId, title]);
  if (rows[0]) return rows[0].id;
  const [result] = await conn.query("INSERT INTO categories (title, tenant_id, is_enabled) VALUES (?, ?, 1)", [title, tenantId]);
  return result.insertId;
}

async function upsertInventoryItem(conn, tenantId, item, createdBy) {
  const [title, quantity, unit, minQuantity] = item;
  const [rows] = await conn.query("SELECT id FROM inventory_items WHERE tenant_id = ? AND title = ? LIMIT 1", [tenantId, title]);
  if (rows[0]) return rows[0].id;

  const status = quantity <= 0 ? "out" : quantity <= minQuantity ? "low" : "in";
  const [result] = await conn.query(
    "INSERT INTO inventory_items (title, quantity, unit, min_quantity_threshold, status, tenant_id) VALUES (?, ?, ?, ?, ?, ?)",
    [title, quantity, unit, minQuantity, status, tenantId]
  );
  await conn.query(
    "INSERT INTO inventory_logs (tenant_id, inventory_item_id, type, quantity_change, previous_quantity, new_quantity, note, created_by) VALUES (?, ?, 'IN', ?, 0, ?, 'Pranav demo initial stock', ?)",
    [tenantId, result.insertId, quantity, quantity, createdBy]
  );
  return result.insertId;
}

async function upsertMenuItem(conn, tenantId, categoryId, item) {
  const [, title, description, price] = item;
  const [rows] = await conn.query("SELECT id FROM menu_items WHERE tenant_id = ? AND title = ? LIMIT 1", [tenantId, title]);
  if (rows[0]) {
    await conn.query(
      "UPDATE menu_items SET description = ?, price = ?, net_price = ?, category = ?, is_enabled = 1 WHERE id = ? AND tenant_id = ?",
      [description, price, price, categoryId, rows[0].id, tenantId]
    );
    return rows[0].id;
  }
  const [result] = await conn.query(
    "INSERT INTO menu_items (title, description, price, net_price, tax_id, category, tenant_id, is_enabled) VALUES (?, ?, ?, ?, NULL, ?, ?, 1)",
    [title, description, price, price, categoryId, tenantId]
  );
  return result.insertId;
}

async function seed() {
  const conn = await getMySqlPromiseConnection();
  try {
    const [users] = await conn.query("SELECT username, tenant_id FROM users WHERE username = ? AND role = 'admin' LIMIT 1", [username]);
    if (!users[0]?.tenant_id) throw new Error(`Admin account not found: ${username}`);

    const tenantId = users[0].tenant_id;
    await conn.beginTransaction();

    const categoryIds = {};
    for (const title of ["Pastries", "Drinks (Beverages)", "Desserts"]) {
      categoryIds[title] = await upsertCategory(conn, tenantId, title);
    }

    const inventoryIds = {};
    for (const item of inventorySeed) {
      inventoryIds[item[0]] = await upsertInventoryItem(conn, tenantId, item, username);
    }

    for (const item of menuSeed) {
      const menuItemId = await upsertMenuItem(conn, tenantId, categoryIds[item[0]], item);
      for (const [inventoryTitle, quantity] of item[4]) {
        await conn.query(
          `INSERT INTO menu_item_recipes (menu_item_id, variant_id, addon_id, inventory_item_id, quantity, tenant_id)
           VALUES (?, 0, 0, ?, ?, ?)
           ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), tenant_id = VALUES(tenant_id)`,
          [menuItemId, inventoryIds[inventoryTitle], quantity, tenantId]
        );
      }
    }

    await conn.query(
      `INSERT INTO store_details (store_name, address, phone, currency, tenant_id)
       VALUES ('Pranav Bakes & Snacks', '7/1-25, SDM Complex, Narasimhanaickenpalayam, Periyanaikanpalayam, Coimbatore', '+919566943737', 'INR', ?)
       ON DUPLICATE KEY UPDATE store_name = VALUES(store_name), address = VALUES(address), phone = VALUES(phone), currency = VALUES(currency)`,
      [tenantId]
    );

    await conn.query(
      `INSERT INTO print_settings (page_format, header, footer, show_notes, is_enable_print, show_store_details, show_customer_details, print_token, tenant_id)
       VALUES (80, 'Pranav Bakes & Snacks', 'Thank you! Visit again.', 1, 1, 1, 1, 1, ?)
       ON DUPLICATE KEY UPDATE page_format = VALUES(page_format), header = VALUES(header), footer = VALUES(footer), show_notes = 1, is_enable_print = 1, show_store_details = 1, show_customer_details = 1, print_token = 1`,
      [tenantId]
    );

    for (const paymentTitle of ["Cash", "Card", "UPI"]) {
      const [payments] = await conn.query("SELECT id FROM payment_types WHERE tenant_id = ? AND title = ? LIMIT 1", [tenantId, paymentTitle]);
      if (!payments[0]) await conn.query("INSERT INTO payment_types (title, is_active, tenant_id) VALUES (?, 1, ?)", [paymentTitle, tenantId]);
    }

    await conn.commit();
    console.log(`Pranav demo ready for tenant ${tenantId}: ${menuSeed.length} menu items and ${inventorySeed.length} inventory items.`);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

seed().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
