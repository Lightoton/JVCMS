package com.javaRangers.jvcms.config;

import com.javaRangers.jvcms.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @org.springframework.beans.factory.annotation.Value("${cors.allowed-origins:http://localhost:3000,http://localhost:3001}")
    private List<String> allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        
                        .requestMatchers("/api/v1/auth/init","/api/v1/auth/init-check", "/api/v1/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/content/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()

                        
                        .requestMatchers("/api/v1/auth/create-client", "/api/v1/auth/users", "/api/v1/auth/users/**").hasRole("ADMIN")

                        
                        .requestMatchers(HttpMethod.PUT, "/api/v1/content/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/content/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/media/upload/**").authenticated()

                        
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            String uri = request.getRequestURI();
            String method = request.getMethod();

            if ("GET".equalsIgnoreCase(method) && (uri.startsWith("/api/v1/content") || uri.startsWith("/uploads"))) {
                CorsConfiguration publicCors = new CorsConfiguration();
                publicCors.setAllowedOrigins(List.of("*"));
                publicCors.setAllowedMethods(List.of("GET", "OPTIONS"));
                publicCors.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                publicCors.setAllowCredentials(false);
                return publicCors;
            }

            CorsConfiguration adminCors = new CorsConfiguration();
            adminCors.setAllowedOrigins(allowedOrigins);
            adminCors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            adminCors.setAllowedHeaders(List.of("Authorization", "Content-Type"));
            adminCors.setAllowCredentials(true);
            return adminCors;
        };
    }
}