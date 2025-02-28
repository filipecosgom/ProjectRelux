package aor.paj.service;

import java.util.HashMap;
import java.util.Map;

import aor.paj.dao.UserDao;
import aor.paj.dto.UserDto;
import aor.paj.bean.UserBean;
import aor.paj.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


//Gere os nossos endpoints de utilizadores
@Path("/users")
public class UserService {

    @Inject
    UserBean userBean;
    UserDao userDao;
    UserDto userDto;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registerUser(UserDto userDto) {
        if (userBean.registerUser(userDto)) {
            return Response.status(200).entity("Novo utilizador registado com sucesso!").build();
        }

        return Response.status(200).entity("Existe um utilizador com o mesmo username. Tente novamente").build();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(UserDto user) {
        String token = userBean.loginUser(user);
        if (token != null) {
            return Response.status(200).entity(token).build();
        }
        return Response.status(200).entity("Token invalido").build();
    }
}
