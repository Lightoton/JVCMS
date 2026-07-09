package com.javaRangers.jvcms.controller;

import com.javaRangers.jvcms.service.ContentItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/content")
@RequiredArgsConstructor
public class ContentItemController {

    private final ContentItemService service;

    @GetMapping("/{schemaIdentifier}")
    public ResponseEntity<Map<String, Object>> getContent(@PathVariable String schemaIdentifier) {
        return ResponseEntity.ok(service.getContent(schemaIdentifier));
    }

    @PutMapping("/{schemaIdentifier}")
    public ResponseEntity<Map<String, Object>> updateContent(
            @PathVariable String schemaIdentifier,
            @RequestBody Map<String, Object> payload) {

        service.saveOrUpdateContent(schemaIdentifier, payload);
        
        return ResponseEntity.ok(payload);
    }

    
    @GetMapping
    public ResponseEntity<java.util.List<String>> getAllSchemas() {
        return ResponseEntity.ok(service.getAllSchemaIdentifiers());
    }

    
    @DeleteMapping("/{schemaIdentifier}")
    public ResponseEntity<Void> deleteContent(@PathVariable String schemaIdentifier) {
        service.deleteContent(schemaIdentifier);
        return ResponseEntity.noContent().build();
    }
}