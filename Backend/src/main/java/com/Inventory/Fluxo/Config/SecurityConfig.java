//// src/main/java/com/Inventory/Fluxo/Config/SecurityConfig.java
//package com.Inventory.Fluxo.Config;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.web.cors.*;
//
//import java.util.Arrays;
//import java.util.List;
//
//@Configuration
//public class SecurityConfig {
//
//    @Value("${frontend.urls}")  // comma-separated origins, no trailing slashes
//    private String frontendUrls;
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // <- let preflight through
//                        .anyRequest().permitAll()
//                );
//        return http.build();
//    }
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration cfg = new CorsConfiguration();
//        // Support dev + prod
//        List<String> origins = Arrays.asList(frontendUrls.split("\\s*,\\s*"));
//        cfg.setAllowedOrigins(origins);
//        // If you need wildcard subdomains, use patterns instead:
//        // cfg.setAllowedOriginPatterns(List.of("https://*.yourdomain.com"));
//
//        cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
//        cfg.setAllowedHeaders(List.of("*"));
//        cfg.setExposedHeaders(List.of("Location"));
//        cfg.setAllowCredentials(true); // only if you use cookies/session
//        cfg.setMaxAge(3600L);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        // Register broadly so OPTIONS on any path gets headers
//        source.registerCorsConfiguration("/**", cfg);
//        return source;
//    }
//}
