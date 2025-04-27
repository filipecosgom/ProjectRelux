// filepath: backend/src/main/java/aor/paj/filters/SessionFilter.java
package aor.paj.filters;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import jakarta.inject.Inject;
import aor.paj.dao.SettingsDao; // Adjust the package path to match the actual location of SettingsDao

@WebFilter("/*")
public class SessionFilter implements Filter {

    @Inject
    private SettingsDao settingsDao;

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
        String timeoutValue = settingsDao.getSettingValue("session_timeout");
        try {
            int timeout = Integer.parseInt(timeoutValue);
            System.out.println("Tempo de expiração configurado: " + timeout + " minutos");
            return timeout;
        } catch (NumberFormatException e) {
            System.out.println("Valor inválido no banco de dados. Usando valor padrão: 30 minutos");
            return 30; // Valor padrão
        }
    }

    private void updateLastAccess(String token) {
        // Atualize o último acesso no banco de dados
    }
}