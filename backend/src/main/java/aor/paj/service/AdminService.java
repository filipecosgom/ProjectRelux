package aor.paj.service;

import aor.paj.dao.SettingsDao;
import aor.paj.entity.UserEntity;
import aor.paj.bean.UserBean;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;

@Path("/admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminService {

    @Inject
    private SettingsDao settingsDao;

    @Inject
    private UserBean userBean;

    @PUT
    @Path("/settings/session-timeout")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateSessionTimeout(@HeaderParam("Authorization") String token, Map<String, Object> body) {
        // Verifica se o usuário é administrador
        if (!isAdmin(token)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Acesso negado.").build();
        }

        try {
            // Extrai o valor de timeout do corpo da requisição
            int timeoutValue = (int) body.get("timeout");

            // Atualiza o tempo de expiração no banco de dados
            settingsDao.updateSetting("session_timeout", String.valueOf(timeoutValue));
            return Response.ok("Tempo de expiração atualizado com sucesso.").build();
        } catch (ClassCastException | NullPointerException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("O valor de timeout deve ser um número inteiro.")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao atualizar o tempo de expiração.")
                    .build();
        }
    }

    @GET
    @Path("/settings/session-timeout")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSessionTimeout(@HeaderParam("Authorization") String token) {
        // Verifica se o usuário é administrador
        if (!isAdmin(token)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Acesso negado.").build();
        }

        try {
            String timeoutValue = settingsDao.getSettingValue("session_timeout");
            return Response.ok("{\"timeout\": " + timeoutValue + "}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao obter o tempo de expiração.")
                    .build();
        }
    }

    private boolean isAdmin(String token) {
        UserEntity loggedInUser = userBean.getUserByToken(token);
        return loggedInUser != null && loggedInUser.isAdmin();
    }
}
