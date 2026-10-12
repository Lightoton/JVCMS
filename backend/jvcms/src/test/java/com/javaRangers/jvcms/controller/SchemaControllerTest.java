package com.javaRangers.jvcms.controller;

import com.javaRangers.jvcms.service.SchemaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class SchemaControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SchemaService schemaService;

    @InjectMocks
    private SchemaController schemaController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(schemaController).build();
    }

    @Test
    void testGetSchema() throws Exception {
        Map<String, Object> mockSchema = Map.of(
                "models", List.of(
                        Map.of("id", "hero", "label", "Hero Section")
                )
        );

        when(schemaService.getSchema()).thenReturn(mockSchema);

        mockMvc.perform(get("/api/v1/schema")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.models[0].id").value("hero"))
                .andExpect(jsonPath("$.models[0].label").value("Hero Section"));
    }
}
