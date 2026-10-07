package com.javaRangers.jvcms.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@Service
@Slf4j
public class SchemaService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${cms.config.path:../../cms.config.json}")
    private String configPath;

    public Map<String, Object> getSchema() {
        try {
            Path path = Paths.get(configPath).normalize();
            if (!Files.exists(path)) {
                log.warn("Schema file not found at path: {}. Returning empty schema.", path.toAbsolutePath());
                return Map.of("models", java.util.List.of());
            }
            
            return objectMapper.readValue(path.toFile(), new TypeReference<Map<String, Object>>() {});
        } catch (IOException e) {
            log.error("Failed to read schema file from {}: {}", configPath, e.getMessage());
            throw new RuntimeException("Failed to read schema configuration.", e);
        }
    }
}
