package com.javaRangers.jvcms.service;

import com.sksamuel.scrimage.ImmutableImage;
import com.sksamuel.scrimage.webp.WebpWriter;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;

@Service
public class MediaService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    
    private final List<String> ALLOWED_MIME_TYPES = List.of("image/jpeg", "image/png", "image/webp");

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory: " + uploadDir, e);
        }
    }

    public Map<String, String> uploadImage(String imageKey, MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Invalid file format. Only JPG, PNG and WEBP are allowed.");
        }

        
        String cleanKey = imageKey.replaceAll("[^a-zA-Z0-9_-]", "");
        if (cleanKey.isBlank()) {
            throw new IllegalArgumentException("Invalid image key");
        }

        try {
            
            deleteExistingFilesByKey(cleanKey);
        } catch (IOException e) {
            System.err.println("Failed to delete existing files for key: " + cleanKey);
        }

        String newFileName = cleanKey + ".webp";
        Path targetLocation = Paths.get(uploadDir).resolve(newFileName).normalize();

        try {
            
            ImmutableImage.loader()
                    .fromStream(file.getInputStream())
                    .output(WebpWriter.DEFAULT.withQ(100), targetLocation);

            return Map.of("url", "/uploads/" + newFileName, "status", "success");

        } catch (Exception e) {
            
            System.err.println("WebP conversion failed, falling back to original format: " + e.getMessage());
            
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "");
            String extension = StringUtils.getFilenameExtension(originalFileName);
            if (extension == null || extension.isBlank()) {
                extension = contentType.equals("image/png") ? "png" : "jpg";
            }
            
            String fallbackName = cleanKey + "." + extension;
            Path fallbackLocation = Paths.get(uploadDir).resolve(fallbackName).normalize();
            
            try {
                
                Files.copy(file.getInputStream(), fallbackLocation, StandardCopyOption.REPLACE_EXISTING);
                return Map.of("url", "/uploads/" + fallbackName, "status", "fallback");
            } catch (IOException ioException) {
                throw new RuntimeException("Failed to save file (Fallback)", ioException);
            }
        }
    }

    private void deleteExistingFilesByKey(String cleanKey) throws IOException {
        Path dirPath = Paths.get(uploadDir);
        if (!Files.exists(dirPath)) return;

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dirPath, cleanKey + ".*")) {
            for (Path entry : stream) {
                Files.deleteIfExists(entry);
            }
        }
    }

    public List<String> listAllMedia() {
        Path dirPath = Paths.get(uploadDir);
        if (!Files.exists(dirPath)) return List.of();

        try (java.util.stream.Stream<Path> stream = Files.walk(dirPath, 1)) {
            return stream
                    .filter(Files::isRegularFile)
                    .map(path -> "/uploads/" + path.getFileName().toString())
                    .toList();
        } catch (IOException e) {
            System.err.println("Failed to list media files: " + e.getMessage());
            return List.of();
        }
    }

    public void deleteMedia(String filename) {
        String cleanName = filename.replaceAll("[^a-zA-Z0-9_\\.-]", "");
        if (cleanName.isBlank()) return;

        Path targetLocation = Paths.get(uploadDir).resolve(cleanName).normalize();
        try {
            Files.deleteIfExists(targetLocation);
        } catch (IOException e) {
            System.err.println("Failed to delete media file: " + e.getMessage());
        }
    }
}