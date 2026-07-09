package com.javaRangers.jvcms.repository;

import com.javaRangers.jvcms.entity.ContentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContentItemRepository extends JpaRepository<ContentItem, UUID> {
    Optional<ContentItem> findBySchemaIdentifier(String schemaIdentifier);
}