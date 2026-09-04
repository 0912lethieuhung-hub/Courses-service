package vn.edu.crs.apigateway.cache;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ApiKeyValidationCacheTest {

    private ApiKeyValidationCache cache;

    @BeforeEach
    void setUp() {
        cache = new ApiKeyValidationCache();
    }

    @Test
    void testCacheMissReturnsNull() {
        assertNull(cache.get("nonexistent-key"));
    }

    @Test
    void testCachePutAndGetValid() {
        cache.put("crs_key_123:courses:read", true);
        Boolean cached = cache.get("crs_key_123:courses:read");
        assertNotNull(cached);
        assertTrue(cached);
    }

    @Test
    void testCachePutAndGetInvalid() {
        cache.put("crs_key_invalid:courses:read", false);
        Boolean cached = cache.get("crs_key_invalid:courses:read");
        assertNotNull(cached);
        assertFalse(cached);
    }
}
