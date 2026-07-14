package com.javaRangers.jvcms.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class MediaServiceTest {

    @InjectMocks
    private MediaService mediaService;

    private Path tempDir;

    @BeforeEach
    void setUp() throws IOException {
        tempDir = Files.createTempDirectory("uploads_test");
        ReflectionTestUtils.setField(mediaService, "uploadDir", tempDir.toString());
        mediaService.init();
    }

    @Test
    void testUploadImage_EmptyFileThrowsException() {
        MultipartFile file = new MockMultipartFile("file", new byte[0]);

        assertThrows(IllegalArgumentException.class, () -> {
            mediaService.uploadImage("test_key", file);
        });
    }

    @Test
    void testUploadImage_InvalidMimeTypeThrowsException() {
        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "data".getBytes());

        assertThrows(IllegalArgumentException.class, () -> {
            mediaService.uploadImage("test_key", file);
        });
    }

    @Test
    void testUploadImage_InvalidKeyThrowsException() {
        MultipartFile file = new MockMultipartFile("file", "test.png", "image/png", "data".getBytes());

        assertThrows(IllegalArgumentException.class, () -> {
            mediaService.uploadImage("!@#$%", file);
        });
    }

    @Test
    void testUploadImage_FallbackSavesOriginalFormat() throws IOException {
        // Fallback triggers because this is not a fully valid image for WebP conversion,
        // but it has valid PNG magic bytes to pass the signature validation.
        byte[] fakePng = new byte[] {
            (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D
        };
        MultipartFile file = new MockMultipartFile("file", "test.png", "image/png", fakePng);

        Map<String, String> result = mediaService.uploadImage("test_image", file);

        assertEquals("fallback", result.get("status"));
        assertTrue(result.get("url").endsWith("test_image.png"));
        assertTrue(Files.exists(tempDir.resolve("test_image.png")));
    }

    @Test
    void testListAllMedia() throws IOException {
        Files.createFile(tempDir.resolve("image1.png"));
        Files.createFile(tempDir.resolve("image2.jpg"));

        List<String> mediaFiles = mediaService.listAllMedia();

        assertEquals(2, mediaFiles.size());
        assertTrue(mediaFiles.contains("/uploads/image1.png"));
        assertTrue(mediaFiles.contains("/uploads/image2.jpg"));
    }

    @Test
    void testDeleteMedia() throws IOException {
        Path file = tempDir.resolve("to_delete.png");
        Files.createFile(file);
        assertTrue(Files.exists(file));

        mediaService.deleteMedia("to_delete.png");

        assertFalse(Files.exists(file));
    }
}
