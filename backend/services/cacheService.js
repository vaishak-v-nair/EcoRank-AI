const cacheStore = new Map();

function getCacheItem(key) {
  const record = cacheStore.get(key);
  if (!record) {
    return null;
  }

  if (Date.now() > record.expiresAt) {
    cacheStore.delete(key);
    return null;
  }

  return record.value;
}

function setCacheItem(key, value, ttlMs) {
  cacheStore.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
}

async function getOrSetCache(key, ttlMs, supplier) {
  const cached = getCacheItem(key);
  if (cached !== null) {
    return cached;
  }

  const value = await supplier();
  setCacheItem(key, value, ttlMs);
  return value;
}

function invalidateByPrefix(prefix) {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
}

module.exports = {
  getOrSetCache,
  invalidateByPrefix
};
