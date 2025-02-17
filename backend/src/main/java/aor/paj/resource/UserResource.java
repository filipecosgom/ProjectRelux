package aor.paj.resource;

import aor.paj.dto.UserDto;
import aor.paj.service.UserService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/users")
public class UserResource {

    @Inject
    UserService userService;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerUser(UserDto userDto) {
        UserDto createdUser = userService.registerUser(userDto);
        return Response.ok(createdUser).build();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(UserDto userDto) {
        UserDto loggedInUser = userService.loginUser(userDto);
        return Response.ok(loggedInUser).build();
    }

    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("username") String username) {
        UserDto userDto = userService.getUserByUsername(username);
        return Response.ok(userDto).build();
    }

    @DELETE
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("username") String username) {
        userService.deleteUserByUsername(username);
        return Response.noContent().build();
    }
}