package vn.edu.crs.authservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.crs.authservice.service.ApiKeyService;

import java.util.Map;

@RestController
@RequestMapping("/internal/api-keys")
@RequiredArgsConstructor
public class InternalApiKeyController {

    private final ApiKeyService apiKeyService;

    @GetMapping("/validate")
    public Map<String, Object> validate(
            @RequestParam String key,
            @RequestParam String scope) {
        boolean valid = apiKeyService.isValidForScope(key, scope);
        return Map.of("valid", valid);
    }
}
