package aor.paj.service;

import aor.paj.dao.SettingsDao;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminService {

    @Inject
    private SettingsDao settingsDao;

    @PUT
    @Path("/settings/session-timeout")
    public Response updateSessionTimeout(@HeaderParam("Authorization") String token, String timeout) {
        // Verifica se o usuário é administrador
        if (!isAdmin(token)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Acesso negado.").build();
        }

        try {
            // Atualiza o tempo de expiração no banco de dados
            settingsDao.updateSetting("session_timeout", timeout);
            return Response.ok("Tempo de expiração atualizado com sucesso.").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao atualizar o tempo de expiração.")
                    .build();
        }
    }

    private boolean isAdmin(String token) {
        // Lógica para verificar se o token pertence a um administrador
        // Decodifique o token JWT e verifique a role do usuário
        // Exemplo simplificado:
        return token != null && token.contains("admin");
    }
}
