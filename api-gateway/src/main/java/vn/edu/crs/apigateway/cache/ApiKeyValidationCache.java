package vn.edu.crs.apigateway.cache;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ApiKeyValidationCache {

    private static final long TTL_SECONDS = 30;

    private record CacheEntry(boolean valid, Instant expiresAt) {}

    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();

    public Boolean get(String cacheKey) {
        CacheEntry entry = cache.get(cacheKey);
        if (entry == null || Instant.now().isAfter(entry.expiresAt())) {
            return null; // khong co trong cache hoac da het han
        }
        return entry.valid();
    }

    public void put(String cacheKey, boolean valid) {
        cache.put(cacheKey, new CacheEntry(valid, Instant.now().plusSeconds(TTL_SECONDS)));
    }
}
