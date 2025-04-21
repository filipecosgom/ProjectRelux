package aor.paj.service;

import java.util.List;

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

import aor.paj.config.ApplicationConfig;


//Gere os nossos endpoints de utilizadores
@Path("/users")
public class UserService {

    private static final String FRONTEND_BASE_URL = "http://localhost:3000";

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
    
// ENDPOINT A FUNCIONAR ANTES DE IMPLEMENTAR PERFIS PUBLICOS
//    @GET
//    @Path("/profile/{username}")
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response getUserProfile(@HeaderParam("Authorization") String token, @PathParam("username") String username) {
//        UserEntity loggedInUser = userBean.getUserByToken(token);
//        if (loggedInUser == null || !loggedInUser.isAdmin()) {
//            return Response.status(401).entity("Sem permissões para esta ação.").build();
//        }
//
//        UserEntity user = userDao.findUserByUsername(username);
//        if (user == null) {
//            return Response.status(404).entity("Utilizador não encontrado").build();
//        }
//
//        UserDto userDto = userBean.convertUserEntityToUserDto(user);
//        return Response.status(200).entity(userDto).build();
//    }


    @GET
    @Path("/profile/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserProfile(@HeaderParam("Authorization") String token, @PathParam("username") String username) {
        UserEntity loggedInUser = null;

        // Verifica se o token foi enviado e tenta identificar o utilizador logado
        if (token != null && !token.isEmpty()) {
            loggedInUser = userBean.getUserByToken(token);
        }

        // Busca o utilizador pelo username
        UserEntity user = userDao.findUserByUsername(username);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Utilizador não encontrado").build();
        }

        // Converte os dados do utilizador para DTO
        UserDto userDto = userBean.convertUserEntityToUserDto(user);

        // Determina se o utilizador logado pode editar este perfil
        boolean canEdit = loggedInUser != null && (loggedInUser.isAdmin() || loggedInUser.getUsername().equals(username));
        userDto.setCanEdit(canEdit);

        return Response.status(Response.Status.OK).entity(userDto).build();
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

    @GET
    @Path("/verify")
    @Produces(MediaType.APPLICATION_JSON)
    public Response verifyAccount(@QueryParam("token") String token) {
        UserEntity user = userDao.findByVerificationToken(token);
        if (user == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"message\": \"Token inválido ou expirado\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }

        user.setIsVerified(true); // Marca a conta como verificada
        user.setVerificationToken(null); // Remove o token de verificação por motivos de segurança
        userDao.merge(user);

        return Response.status(Response.Status.OK)
                .entity("{\"message\": \"Conta confirmada com sucesso!\"}")
                .type(MediaType.APPLICATION_JSON)
                .build();
    }

    @PUT
    @Path("/products/buy/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response buyProduct(@HeaderParam("Authorization") String token, @PathParam("id") int productId) {
        UserEntity user = userBean.getUserByToken(token);
        if (user == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
        }

        if (!user.isVerified()) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("Necessita verificar a sua conta antes de comprar produtos.").build();
        }

        // Lógica para processar a compra...
        return Response.status(Response.Status.OK).entity("Produto comprado com sucesso!").build();
    }

    @POST
    @Path("/recover-password")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
public Response recoverPassword(@HeaderParam("Authorization") String token, @QueryParam("email") String email) {
    UserEntity user;

    // Verifica se o token de autenticação foi enviado
    if (token != null && !token.isEmpty()) {
        user = userBean.getUserByToken(token); // Identifica o utilizador logado pelo token
        if (user == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
        }
    } else if (email != null && !email.isEmpty()) {
        user = userDao.findUserByEmail(email); // Identifica o utilizador pelo email
        
        // Busca o utilizador pelo email
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Utilizador não encontrado").build();
        }
            } else {
        return Response.status(Response.Status.BAD_REQUEST).entity("Token ou email são necessários").build();
    }

        // Gera um novo token de recuperação
        String recoveryToken = userBean.generateNewToken();
        user.setPasswordRecoveryToken(recoveryToken);

        // Define a validade do token (10 minutos a partir de agora)
        user.setPasswordRecoveryTokenExpiration(java.time.LocalDateTime.now().plusMinutes(10));
        userDao.merge(user);

        // Exibe o link de recuperação na consola
        String recoveryLink = ApplicationConfig.FRONTEND_BASE_URL + "/reset-password?token=" + recoveryToken;
        System.out.println("Link de recuperação: " + recoveryLink);

            return Response.status(Response.Status.OK)
            .entity("{\"recoveryToken\": \"" + recoveryToken + "\"}")
            .type(MediaType.APPLICATION_JSON)
            .build();
    }

    @POST
    @Path("/reset-password")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(@QueryParam("token") String token, @QueryParam("newPassword") String newPassword) {
        // Busca o utilizador pelo token de recuperação
        UserEntity user = userDao.findByPasswordRecoveryToken(token);
        if (user == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Token inválido ou expirado").build();
        }

        // Verifica se o token expirou
        if (user.getPasswordRecoveryTokenExpiration() == null ||
                user.getPasswordRecoveryTokenExpiration().isBefore(java.time.LocalDateTime.now())) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Token expirado").build();
        }

        // Atualiza a senha do utilizador
        user.setPassword(userBean.hashPassword(newPassword));
        user.setPasswordRecoveryToken(null); // Remove o token após redefinir a senha
        user.setPasswordRecoveryTokenExpiration(null); // Remove a validade do token
        userDao.merge(user);

        return Response.status(Response.Status.OK).entity("Senha redefinida com sucesso!").build();
    }

    @POST
    @Path("/resend-verification")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resendVerificationToken(@QueryParam("email") String email) {
        UserEntity user = userDao.findUserByEmail(email);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Utilizador não encontrado").build();
        }

        if (user.isVerified()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Conta já verificada").build();
        }

        String newToken = userBean.generateNewToken();
        user.setVerificationToken(newToken);
        userDao.merge(user);

        // Exibe o link de verificação na consola (substituir por envio de email no futuro)
        System.out.println(
                "Novo link de verificação: http://localhost:8080/filipe-proj5/rest/users/verify?token=" + newToken);

        return Response.status(Response.Status.OK).entity("Novo link de verificação enviado").build();
    }

    @PUT
    @Path("/activate/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response activateUser(@HeaderParam("Authorization") String token, @PathParam("username") String username) {
        UserEntity loggedInUser = userBean.getUserByToken(token);
        if (loggedInUser == null || !loggedInUser.isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN).entity("Sem permissões para esta ação").build();
        }

        UserEntity user = userDao.findUserByUsername(username);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Utilizador não encontrado").build();
        }

        user.setIsVerified(true);
        user.setVerificationToken(null);
        userDao.merge(user);

        return Response.status(Response.Status.OK).entity("Conta ativada com sucesso").build();
    }

}