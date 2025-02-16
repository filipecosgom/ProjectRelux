package aor.paj.resource;
/*

import aor.paj.bean.UserBean;
import aor.paj.dto.UserDto;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/users")
public class UserService {

    @Inject
    UserBean userBean;

    @Context
    private HttpServletRequest request;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response register(UserDto user) {
        if (userBean.register(user.getUsername(), user.getPassword())) {
            return Response.status(200).entity("Parabéns! Novo utilizador registado!").build();
        }
        return Response.status(200).entity("Erro! temos um utilizador registado com o mesmo username").build();

    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(UserDto user) {
        if (userBean.login(user.getUsername(), user.getPassword())) {
            return Response.status(200).entity("Login efetuado com sucesso").build();
        }
        return Response.status(200).entity("Erro de Login").build();
    }
}


 */