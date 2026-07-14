package com.javaRangers.jvcms.service;

import com.javaRangers.jvcms.entity.ContentItem;
import com.javaRangers.jvcms.repository.ContentItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ContentItemService {

    private final ContentItemRepository repository;

    @Transactional(readOnly = true)
    public Map<String, Object> getContent(String schemaIdentifier) {
        validateSchemaIdentifier(schemaIdentifier);
        return repository.findBySchemaIdentifier(schemaIdentifier)
                .map(ContentItem::getData)
                .orElse(Map.of());
    }

    @Transactional
    public ContentItem saveOrUpdateContent(String schemaIdentifier, Map<String, Object> data) {
        validateSchemaIdentifier(schemaIdentifier);

        ContentItem item = repository.findBySchemaIdentifier(schemaIdentifier)
                .orElseGet(() -> {
                    ContentItem newItem = new ContentItem();
                    newItem.setSchemaIdentifier(schemaIdentifier);
                    return newItem;
                });

        item.setData(data);
        return repository.save(item);
    }
    
    @Transactional(readOnly = true)
    public List<String> getAllSchemaIdentifiers() {
        return repository.findAll().stream()
                .map(ContentItem::getSchemaIdentifier)
                .toList();
    }

    
    @Transactional
    public void deleteContent(String schemaIdentifier) {
        validateSchemaIdentifier(schemaIdentifier);
        repository.findBySchemaIdentifier(schemaIdentifier)
                .ifPresent(repository::delete);
    }

    private void validateSchemaIdentifier(String schemaIdentifier) {
        if (schemaIdentifier == null || !schemaIdentifier.matches("^[a-zA-Z0-9_-]+$")) {
            throw new IllegalArgumentException("Invalid schema identifier. Only alphanumeric characters, dashes, and underscores are allowed.");
        }
    }
}