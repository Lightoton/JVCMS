package com.javaRangers.jvcms.controller;

import com.javaRangers.jvcms.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadMedia(@RequestParam("file") MultipartFile file) {
        String imageKey = UUID.randomUUID().toString();
        Map<String, String> result = mediaService.uploadImage(imageKey, file);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/list")
    public ResponseEntity<java.util.List<String>> listMedia() {
        return ResponseEntity.ok(mediaService.listAllMedia());
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteMedia(@RequestParam("filename") String filename) {
        mediaService.deleteMedia(filename);
        return ResponseEntity.noContent().build();
    }
}
