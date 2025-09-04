import logger from "./logger";

const LINKS_KEY = "shortlinks_v1";

function loadLinks() {
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveLinks(obj) {
  try {
    localStorage.setItem(LINKS_KEY, JSON.stringify(obj));
  } catch {
    // fail silently (no console)
  }
}

function getAll() {
  return loadLinks();
}

function get(code) {
  const all = loadLinks();
  return all[code] || null;
}

function upsert(item) {
  const all = loadLinks();
  all[item.code] = item;
  saveLinks(all);
  logger.log("store_upsert", "Upserted link", { code: item.code });
}

function remove(code) {
  const all = loadLinks();
  delete all[code];
  saveLinks(all);
  logger.log("store_remove", "Removed link", { code });
}

function exists(code) {
  const all = loadLinks();
  return Boolean(all[code]);
}

function incrementClicks(code) {
  const all = loadLinks();
  const rec = all[code];
  if (!rec) return;
  rec.clicks = (rec.clicks || 0) + 1;
  all[code] = rec;
  saveLinks(all);
  logger.log("store_increment", "Incremented click", { code });
}

export default {
  getAll,
  get,
  upsert,
  remove,
  exists,
  incrementClicks,
};
