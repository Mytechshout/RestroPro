const PRINTER_MODE_KEY = "ONEOSPOS__PRINTER_MODE";
const BLUETOOTH_MODE = "bluetooth";

let activePort = null;

export function getPrinterMode() {
  return localStorage.getItem(PRINTER_MODE_KEY) || "system";
}

export function setPrinterMode(mode) {
  const normalizedMode = mode === BLUETOOTH_MODE ? BLUETOOTH_MODE : "system";
  localStorage.setItem(PRINTER_MODE_KEY, normalizedMode);
  return normalizedMode;
}

export function isBluetoothPrinterSupported() {
  return window.isSecureContext && "serial" in navigator;
}

function asciiText(value = "") {
  return String(value)
    .replaceAll("₹", "Rs.")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E\n]/g, "");
}

function center(value, width) {
  const text = asciiText(value).trim().slice(0, width);
  const leftPadding = Math.max(0, Math.floor((width - text.length) / 2));
  return `${" ".repeat(leftPadding)}${text}`;
}

function twoColumns(leftValue, rightValue, width) {
  const left = asciiText(leftValue).trim();
  const right = asciiText(rightValue).trim();
  const maxLeftLength = Math.max(1, width - right.length - 1);
  const visibleLeft = left.slice(0, maxLeftLength);
  const gap = Math.max(1, width - visibleLeft.length - right.length);
  return `${visibleLeft}${" ".repeat(gap)}${right.slice(0, width - visibleLeft.length - gap)}`;
}

function money(currency, value) {
  return `${asciiText(currency || "Rs.")}${Number(value || 0).toFixed(2)}`;
}

export function buildEscPosReceipt(details) {
  const {
    cartItems = [],
    deliveryType,
    customerType,
    customer,
    currency,
    storeSettings = {},
    printSettings = {},
    itemsTotal,
    taxTotal,
    serviceChargeTotal,
    payableTotal,
    tokenNo,
    paymentMethod,
  } = details || {};

  const pageFormat = Number(printSettings.page_format || printSettings.pageFormat || 80);
  const width = pageFormat <= 58 ? 32 : 48;
  const separator = "-".repeat(width);
  const showStoreDetails = Number(printSettings.show_store_details ?? printSettings.showStoreDetails ?? 1) === 1;
  const showCustomerDetails = Number(printSettings.show_customer_details ?? printSettings.showCustomerDetails ?? 1) === 1;
  const showNotes = Number(printSettings.show_notes ?? printSettings.showNotes ?? 1) === 1;
  const printToken = Number(printSettings.print_token ?? printSettings.printToken ?? 0) === 1;
  const lines = [];

  if (showStoreDetails) {
    lines.push(center(storeSettings.store_name || "OneOs Pos", width));
    if (storeSettings.address) lines.push(center(storeSettings.address, width));
    if (storeSettings.phone) lines.push(center(`Phone: ${storeSettings.phone}`, width));
  }

  if (printSettings.header) lines.push(separator, center(printSettings.header, width));
  if (showCustomerDetails) {
    lines.push(separator, `Customer: ${customer?.name || customerType || "Walk-in"}`);
    if (deliveryType) lines.push(`Order type: ${deliveryType}`);
  }
  if (paymentMethod) lines.push(`Payment: ${paymentMethod}`);

  lines.push(separator);
  if (tokenNo) lines.push(`Receipt: ${tokenNo}-${new Date().toISOString().slice(0, 10)}`);
  lines.push(new Date().toLocaleString(), separator);

  for (const item of cartItems) {
    const title = `${item.title || "Item"}${item.variant?.title ? ` - ${item.variant.title}` : ""}`;
    lines.push(asciiText(title).slice(0, width));
    if (item.addons_ids?.length) {
      const addonTitles = item.addons_ids
        .map((addonId) => item.addons?.find((addon) => addon.id == addonId)?.title)
        .filter(Boolean)
        .join(", ");
      if (addonTitles) lines.push(`Add-ons: ${asciiText(addonTitles).slice(0, width - 9)}`);
    }
    if (showNotes && item.notes) lines.push(`Notes: ${asciiText(item.notes).slice(0, width - 7)}`);
    lines.push(
      twoColumns(
        `${Number(item.quantity || 0)} x ${money(currency, item.price)}`,
        money(currency, Number(item.quantity || 0) * Number(item.price || 0)),
        width
      )
    );
  }

  lines.push(
    separator,
    twoColumns("Subtotal", money(currency, itemsTotal), width),
    twoColumns("Tax", money(currency, taxTotal), width),
    twoColumns("Service charge", money(currency, serviceChargeTotal), width),
    twoColumns("TOTAL", money(currency, payableTotal), width),
    separator
  );

  if (printSettings.footer) lines.push(center(printSettings.footer, width));
  if (printToken && tokenNo) lines.push("", center("TOKEN", width), center(tokenNo, width));

  return `${lines.join("\n")}\n\n\n`;
}

async function getBluetoothPort({ requestDevice = false } = {}) {
  if (!isBluetoothPrinterSupported()) {
    throw new Error("Bluetooth printing requires a current version of Chrome on Android or desktop.");
  }

  if (activePort?.connected !== false) return activePort;

  const grantedPorts = await navigator.serial.getPorts();
  activePort = grantedPorts.find((port) => port.getInfo().bluetoothServiceClassId) || grantedPorts[0] || null;

  if (!activePort && requestDevice) {
    activePort = await navigator.serial.requestPort();
  }

  if (!activePort) {
    throw new Error("Connect the Bluetooth printer from Print Settings before printing an order.");
  }

  return activePort;
}

async function sendEscPos(text, { requestDevice = false } = {}) {
  const port = await getBluetoothPort({ requestDevice });
  if (!port.writable) await port.open({ baudRate: 9600, bufferSize: 4096 });

  const writer = port.writable.getWriter();
  const encoder = new TextEncoder();
  const initialize = new Uint8Array([0x1b, 0x40]);
  const cutAndFeed = new Uint8Array([0x0a, 0x0a, 0x1d, 0x56, 0x41, 0x10]);

  try {
    await writer.write(initialize);
    await writer.write(encoder.encode(asciiText(text)));
    await writer.write(cutAndFeed);
  } finally {
    writer.releaseLock();
    await port.close();
    activePort = null;
  }
}

export async function printReceiptViaBluetooth(details) {
  await sendEscPos(buildEscPosReceipt(details));
}

export async function connectAndTestBluetoothPrinter(pageFormat = 80) {
  const width = Number(pageFormat) <= 58 ? 32 : 48;
  const testReceipt = [
    center("OneOs Pos", width),
    center("Bluetooth printer test", width),
    "-".repeat(width),
    "Connection successful",
    new Date().toLocaleString(),
    "-".repeat(width),
    center("Ready to print orders", width),
    "\n\n",
  ].join("\n");

  await sendEscPos(testReceipt, { requestDevice: true });
}
