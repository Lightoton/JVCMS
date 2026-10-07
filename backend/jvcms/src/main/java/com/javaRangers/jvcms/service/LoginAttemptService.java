package com.javaRangers.jvcms.service;

import com.github.benmanes.caffeine.cache.CacheLoader;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class LoginAttemptService {

    private static final Logger log = LoggerFactory.getLogger(LoginAttemptService.class);

    private final int MAX_ATTEMPT = 5;

    private final LoadingCache<String, Integer> attemptsCache;

    public LoginAttemptService() {
        super();
        attemptsCache = Caffeine.newBuilder()
                .expireAfterWrite(15, TimeUnit.MINUTES)
                .build(new CacheLoader<String, Integer>() {
                    public Integer load(String key) {
                        return 0;
                    }
                });
    }

    public void loginSucceeded(String key) {
        attemptsCache.invalidate(key);
    }

    public void loginFailed(String key) {
        int attempts = 0;
        try {
            attempts = attemptsCache.get(key);
        } catch (Exception e) {
            log.warn("Login attempt check failed for IP {}: {}", key, e.getMessage());
            attempts = 0;
        }
        attempts++;
        attemptsCache.put(key, attempts);
    }

    public boolean isBlocked(String key) {
        try {
            return attemptsCache.get(key) >= MAX_ATTEMPT;
        } catch (Exception e) {
            log.warn("Failed to check if IP {} is blocked: {}", key, e.getMessage());
            return false;
        }
    }
}
