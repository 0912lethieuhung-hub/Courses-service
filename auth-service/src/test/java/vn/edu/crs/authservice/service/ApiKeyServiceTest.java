package vn.edu.crs.authservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.edu.crs.authservice.dto.ApiKeyCreateRequestDTO;
import vn.edu.crs.authservice.dto.ApiKeyResponseDTO;
import vn.edu.crs.authservice.entity.ApiKey;
import vn.edu.crs.authservice.repository.ApiKeyRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApiKeyServiceTest {

    @Mock
    private ApiKeyRepository apiKeyRepository;

    private ApiKeyService apiKeyService;

    @BeforeEach
    void setUp() {
        apiKeyService = new ApiKeyService(apiKeyRepository);
    }

    @Test
    void testCreateApiKey() {
        ApiKeyCreateRequestDTO dto = new ApiKeyCreateRequestDTO();
        dto.setOwnerName("Test Partner");
        dto.setScopes("courses:read,courses:read-detail");
        dto.setValidDays(30);

        when(apiKeyRepository.save(any(ApiKey.class))).thenAnswer(invocation -> {
            ApiKey k = invocation.getArgument(0);
            k.setId(1L);
            return k;
        });

        ApiKeyResponseDTO response = apiKeyService.create(dto);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Partner", response.getOwnerName());
        assertEquals("courses:read,courses:read-detail", response.getScopes());
        assertEquals("ACTIVE", response.getStatus());
        assertTrue(response.getKeyValue().startsWith("crs_"));
        assertNotNull(response.getExpiresAt());
        assertNotNull(response.getCreatedAt());
        verify(apiKeyRepository, times(1)).save(any(ApiKey.class));
    }

    @Test
    void testGetAll() {
        ApiKey key = new ApiKey(1L, "crs_test123", "Partner 1", "courses:read", "ACTIVE", null, LocalDateTime.now());
        when(apiKeyRepository.findAll()).thenReturn(List.of(key));

        List<ApiKeyResponseDTO> list = apiKeyService.getAll();
        assertEquals(1, list.size());
        assertEquals("Partner 1", list.get(0).getOwnerName());
    }

    @Test
    void testRevoke() {
        ApiKey key = new ApiKey(1L, "crs_test123", "Partner 1", "courses:read", "ACTIVE", null, LocalDateTime.now());
        when(apiKeyRepository.findById(1L)).thenReturn(Optional.of(key));

        apiKeyService.revoke(1L);

        assertEquals("REVOKED", key.getStatus());
        verify(apiKeyRepository, times(1)).save(key);
    }

    @Test
    void testRevokeNotFound() {
        when(apiKeyRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> apiKeyService.revoke(999L));
    }

    @Test
    void testIsValidForScope_Success() {
        ApiKey key = new ApiKey(1L, "crs_valid", "Partner 1", "courses:read,courses:read-detail", "ACTIVE",
                LocalDateTime.now().plusDays(10), LocalDateTime.now());
        when(apiKeyRepository.findByKeyValue("crs_valid")).thenReturn(Optional.of(key));

        assertTrue(apiKeyService.isValidForScope("crs_valid", "courses:read"));
        assertTrue(apiKeyService.isValidForScope("crs_valid", "courses:read-detail"));
    }

    @Test
    void testIsValidForScope_WrongScope() {
        ApiKey key = new ApiKey(1L, "crs_valid", "Partner 1", "courses:read", "ACTIVE",
                LocalDateTime.now().plusDays(10), LocalDateTime.now());
        when(apiKeyRepository.findByKeyValue("crs_valid")).thenReturn(Optional.of(key));

        assertFalse(apiKeyService.isValidForScope("crs_valid", "registrations:write"));
    }

    @Test
    void testIsValidForScope_Revoked() {
        ApiKey key = new ApiKey(1L, "crs_revoked", "Partner 1", "courses:read", "REVOKED",
                LocalDateTime.now().plusDays(10), LocalDateTime.now());
        when(apiKeyRepository.findByKeyValue("crs_revoked")).thenReturn(Optional.of(key));

        assertFalse(apiKeyService.isValidForScope("crs_revoked", "courses:read"));
    }

    @Test
    void testIsValidForScope_Expired() {
        ApiKey key = new ApiKey(1L, "crs_expired", "Partner 1", "courses:read", "ACTIVE",
                LocalDateTime.now().minusDays(1), LocalDateTime.now().minusDays(30));
        when(apiKeyRepository.findByKeyValue("crs_expired")).thenReturn(Optional.of(key));

        assertFalse(apiKeyService.isValidForScope("crs_expired", "courses:read"));
    }

    @Test
    void testIsValidForScope_NonExistent() {
        when(apiKeyRepository.findByKeyValue("crs_unknown")).thenReturn(Optional.empty());
        assertFalse(apiKeyService.isValidForScope("crs_unknown", "courses:read"));
    }
}
