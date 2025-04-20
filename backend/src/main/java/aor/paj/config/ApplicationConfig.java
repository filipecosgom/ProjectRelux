package aor.paj.config;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

// Esta classe configura o caminho base para todos os endpoints REST
@ApplicationPath("/rest")  // Define o caminho base da API REST
public class ApplicationConfig extends Application {

    // Variável global para a URL base do frontend
    public static final String FRONTEND_BASE_URL = "http://localhost:3000";

    // Não é necessário implementar interfaces de listener aqui
    // O WildFly irá automaticamente reconhecer a configuração do JAX-RS
}
