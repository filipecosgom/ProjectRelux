package aor.paj.filters;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/*")  // Aplica o filtro a todos os endpoints da aplicação
public class CorsFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Este mét0do é chamado uma vez quando o filtro é inicializado
        // Podemos usar este mét0do para configurar recursos que o filtro possa precisar.
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // Converte os objetos genéricos ServletRequest e ServletResponse para HttpServletRequest e HttpServletResponse
        // Isso permite acessar métodos HTTP específicos, como os cabeçalhos.
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        // Definir os cabeçalhos CORS necessários na resposta
        // Permite que qualquer origem acesse os recursos da API
        httpResponse.setHeader("Access-Control-Allow-Origin", "*");  // Permitir qualquer origem (pode ajustar para domínios específicos)

        // Define os métodos HTTP que são permitidos para a requisição (ex: GET, POST, etc)
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");  // Métodos permitidos

        // Define os cabeçalhos que podem ser usados na requisição
        // Permite que o cliente envie cabeçalhos adicionais como origin, content-type, accept, etc.
        httpResponse.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");

        // Define quais cabeçalhos da resposta podem ser expostos ao cliente
        // Os cabeçalhos que podem ser acessados pela aplicação cliente
        httpResponse.setHeader("Access-Control-Expose-Headers", "origin, content-type, accept, authorization");

        // Permite que o cliente envie cookies e credenciais (como sessões) junto com a requisição
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");

        // Se a requisição for do tipo OPTIONS (preflight request), não é necessário processar mais nada
        // O navegador envia uma requisição OPTIONS antes de fazer uma requisição real para verificar as permissões de CORS
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);  // Retorna um código HTTP 200 OK para a requisição OPTIONS
            return;  // Não faz nada mais com a requisição, apenas responde
        }

        // Continua o processamento da requisição para o próximo filtro ou o endpoint real
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Mét0do chamado quando o filtro é destruído
        // Podemos liberar recursos ou realizar a limpeza se necessário
    }
}
