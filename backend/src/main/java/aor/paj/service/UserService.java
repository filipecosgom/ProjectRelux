package aor.paj.service;

import java.util.HashMap;
import java.util.List;
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

    @Inject
    UserDao userDao;



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
        if (user == null || user.getUsername() == null || user.getPassword() == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Dados de login inválidos").build();
        }

        String token = userBean.loginUser(user);
        if (token == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
        }

        return Response.status(Response.Status.OK).entity(token).build();
    }

    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@HeaderParam("Authorization") String token, UserDto userDto) {
        UserEntity loggedInUser = userBean.getUserByToken(token);
        if (loggedInUser == null) {
            return Response.status(404).entity("Token inválido").build();
        }

        if (!loggedInUser.isAdmin() && !loggedInUser.getUsername().equals(userDto.getUsername())) {
            return Response.status(Response.Status.FORBIDDEN).entity("Não pode alterar dados deste utilizador.").build();
        }

        if (userBean.updateUser(userDto)) {
            return Response.status(200).entity("Dados atualizados").build();
        }
        return Response.status(404).entity("Utilizador não encontrado").build();
    }

    @GET
    @Path("/checkUsername")
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkUsernameExists(@QueryParam("username") String username) {
        UserEntity user = userDao.findUserByUsername(username);
        boolean exists = user != null;
        return Response.status(200).entity("{\"exists\": " + exists + "}").build();
    }

    @POST
    @Path("/logout")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response logoutUser(@HeaderParam("Authorization") String token) {
        if (userBean.logoutUser(token)) {
            return Response.status(Response.Status.OK).entity("Logout realizado com sucesso!").build();
        }
        return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
    }

    @GET
    @Path("/profile/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserProfile(@HeaderParam("Authorization") String token, @PathParam("username") String username) {
        UserEntity loggedInUser = userBean.getUserByToken(token);
        if (loggedInUser == null || !loggedInUser.isAdmin()) {
            return Response.status(401).entity("Sem permissões para esta ação.").build();
        }

        UserEntity user = userDao.findUserByUsername(username);
        if (user == null) {
            return Response.status(404).entity("Utilizador não encontrado").build();
        }

        UserDto userDto = userBean.convertUserEntityToUserDto(user);
        return Response.status(200).entity(userDto).build();
    }

    @DELETE
    @Path("/delete/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@HeaderParam("Authorization") String token, @PathParam("username") String username) {
        UserEntity loggedInUser = userBean.getUserByToken(token);
        if (loggedInUser == null || !loggedInUser.isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN).entity("Não pode fazer esta ação").build();
        }

        if (loggedInUser.getUsername().equals(username)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Não é permitido apagar o seu próprio perfil").build();
        }

        boolean success = userBean.deleteUser(username);
        if (success) {
            return Response.status(Response.Status.OK).entity("Utilizador apagado com sucesso!").build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Utilizador não encontrado").build();
        }
    }

    @DELETE
    @Path("/soft-delete/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response softDeleteUser(@HeaderParam("Authorization") String token, @PathParam("username") String username) {
        UserEntity loggedInUser = userBean.getUserByToken(token);
        if (loggedInUser == null || !loggedInUser.isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN).entity("Sem permissões para esta ação").build();
        }

        if (loggedInUser.getUsername().equals(username)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Não é possível apagar o seu próprio perfil").build();
        }

        boolean success = userBean.softDeleteUser(username);
        if (success) {
            return Response.status(Response.Status.OK).entity("Utilizador apagado com sucesso!").build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Utilizador não encontrado").build();
        }
    }
    @GET
    @Path("/deleted")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDeletedUsers(@HeaderParam("Authorization") String token) {
        UserEntity loggedInUser = userBean.getUserByToken(token);
        if (loggedInUser == null || !loggedInUser.isAdmin()) {
            return Response.status(404).entity("Sem permissões para esta funcionalidade").build();
        }

        List<UserDto> deletedUsers = userBean.getDeletedUsers();
        return Response.status(200).entity(deletedUsers).build();
    }

    @GET
    @Path("/me")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserInfo(@HeaderParam("Authorization") String token) {
        UserEntity loggedInUser = userBean.getUserByToken(token);
        System.out.println("get user info token!!!!!!!!!" + token);
        if (loggedInUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
        }

        UserDto userDto = userBean.convertUserEntityToUserDto(loggedInUser);
        return Response.status(Response.Status.OK).entity(userDto).build();
    }

}

@GET
@Path("/all")
@Produces(MediaType.APPLICATION_JSON)
public Response getAllUsers(@HeaderParam("Authorization") String token) {
    UserEntity loggedInUser = userBean.getUserByToken(token);
    if (loggedInUser == null || !loggedInUser.isAdmin()) {
        return Response.status(Response.Status.FORBIDDEN).entity("Sem permissões para esta ação.").build();
    }

    List<UserDto> allUsers = userBean.getAllUsers();
    return Response.status(Response.Status.OK).entity(allUsers).build();
}
}
