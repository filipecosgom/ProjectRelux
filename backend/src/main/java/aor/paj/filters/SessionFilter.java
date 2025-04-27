// filepath: backend/src/main/java/aor/paj/filters/SessionFilter.java
package aor.paj.filters;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;

@WebFilter("/*")
public class SessionFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String token = httpRequest.getHeader("Authorization");
        if (token != null && !token.isEmpty()) {
            // Verifique o tempo de expiração aqui
            LocalDateTime lastAccess = getLastAccessFromToken(token);
            int sessionTimeout = getSessionTimeoutFromSettings();

            if (lastAccess.plusMinutes(sessionTimeout).isBefore(LocalDateTime.now())) {
                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // Atualize o último acesso
            updateLastAccess(token);
        }

        chain.doFilter(request, response);
    }

    private LocalDateTime getLastAccessFromToken(String token) {
        // Decodifique o token JWT e obtenha o último acesso
        return LocalDateTime.now(); // Exemplo
    }

    private int getSessionTimeoutFromSettings() {
        // Obtenha o tempo de expiração da tabela settings
        return 30; // Exemplo
    }

    private void updateLastAccess(String token) {
        // Atualize o último acesso no banco de dados
    }
}