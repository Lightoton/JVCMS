package com.javaRangers.jvcms.controller;

import com.javaRangers.jvcms.service.SchemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/schema")
@RequiredArgsConstructor
public class SchemaController {

    private final SchemaService schemaService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSchema() {
        return ResponseEntity.ok(schemaService.getSchema());
    }
}
