package aor.paj.config;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

// Configura o caminho para todos os endpoints REST
@ApplicationPath("/rest")
public class ApplicationConfig extends Application {}