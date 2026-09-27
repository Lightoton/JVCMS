package com.javaRangers.jvcms.service;

import com.javaRangers.jvcms.entity.ContentItem;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Map;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
class ContentItemServiceIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private ContentItemService contentItemService;

    @Test
    void testSaveAndRetrieveContent() {
        // Ensure container is running
        assertThat(postgres.isRunning()).isTrue();

        // Save new content
        String schemaId = "home-page";
        Map<String, Object> data = Map.of("title", "Welcome", "description", "Test Description");
        
        ContentItem savedItem = contentItemService.saveOrUpdateContent(schemaId, data);
        
        assertThat(savedItem).isNotNull();
        assertThat(savedItem.getSchemaIdentifier()).isEqualTo(schemaId);
        
        // Retrieve content
        Map<String, Object> retrievedData = contentItemService.getContent(schemaId);
        
        assertThat(retrievedData).isNotEmpty();
        assertThat(retrievedData.get("title")).isEqualTo("Welcome");
        assertThat(retrievedData.get("description")).isEqualTo("Test Description");

        // Verify it appears in the list
        List<String> schemas = contentItemService.getAllSchemaIdentifiers();
        assertThat(schemas).contains(schemaId);

        // Update content
        Map<String, Object> newData = Map.of("title", "Welcome Updated", "description", "Test Description");
        contentItemService.saveOrUpdateContent(schemaId, newData);

        Map<String, Object> updatedData = contentItemService.getContent(schemaId);
        assertThat(updatedData.get("title")).isEqualTo("Welcome Updated");

        // Delete content
        contentItemService.deleteContent(schemaId);
        Map<String, Object> deletedData = contentItemService.getContent(schemaId);
        assertThat(deletedData).isEmpty();
    }
}
