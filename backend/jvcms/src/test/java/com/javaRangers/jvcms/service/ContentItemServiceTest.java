package com.javaRangers.jvcms.service;

import com.javaRangers.jvcms.entity.ContentItem;
import com.javaRangers.jvcms.repository.ContentItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContentItemServiceTest {

    @Mock
    private ContentItemRepository repository;

    @InjectMocks
    private ContentItemService contentItemService;

    private ContentItem contentItem;

    @BeforeEach
    void setUp() {
        contentItem = new ContentItem();
        contentItem.setSchemaIdentifier("home_page");
        contentItem.setData(Map.of("title", "Hello World"));
    }

    @Test
    void testGetContent_Success() {
        when(repository.findBySchemaIdentifier("home_page")).thenReturn(Optional.of(contentItem));

        Map<String, Object> data = contentItemService.getContent("home_page");

        assertFalse(data.isEmpty());
        assertEquals("Hello World", data.get("title"));
    }

    @Test
    void testGetContent_EmptyWhenNotFound() {
        when(repository.findBySchemaIdentifier("unknown")).thenReturn(Optional.empty());

        Map<String, Object> data = contentItemService.getContent("unknown");

        assertTrue(data.isEmpty());
    }

    @Test
    void testSaveOrUpdateContent_NewItem() {
        when(repository.findBySchemaIdentifier("about_page")).thenReturn(Optional.empty());
        when(repository.save(any(ContentItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContentItem result = contentItemService.saveOrUpdateContent("about_page", Map.of("content", "About us"));

        assertNotNull(result);
        assertEquals("about_page", result.getSchemaIdentifier());
        assertEquals("About us", result.getData().get("content"));
        verify(repository, times(1)).save(any(ContentItem.class));
    }

    @Test
    void testSaveOrUpdateContent_ExistingItem() {
        when(repository.findBySchemaIdentifier("home_page")).thenReturn(Optional.of(contentItem));
        when(repository.save(any(ContentItem.class))).thenReturn(contentItem);

        ContentItem result = contentItemService.saveOrUpdateContent("home_page", Map.of("title", "New Title"));

        assertEquals("New Title", result.getData().get("title"));
        verify(repository, times(1)).save(contentItem);
    }

    @Test
    void testSaveOrUpdateContent_ThrowsOnEmptySchema() {
        assertThrows(IllegalArgumentException.class, () -> {
            contentItemService.saveOrUpdateContent("", Map.of());
        });
    }

    @Test
    void testGetAllSchemaIdentifiers() {
        when(repository.findAll()).thenReturn(List.of(contentItem));

        List<String> schemas = contentItemService.getAllSchemaIdentifiers();

        assertEquals(1, schemas.size());
        assertEquals("home_page", schemas.get(0));
    }

    @Test
    void testDeleteContent() {
        when(repository.findBySchemaIdentifier("home_page")).thenReturn(Optional.of(contentItem));

        contentItemService.deleteContent("home_page");

        verify(repository, times(1)).delete(contentItem);
    }
}
