package aor.paj.service;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.UserDao;
import aor.paj.entity.CategoryEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Stateless


@Path("/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CategoryService {

    @Inject
    private CategoryDao categoryDao;

    @Inject
    private UserDao userDao;

    @POST
    @Path("/new")
    public Response createCategory(@HeaderParam("token") String token, CategoryEntity category) {
        UserEntity user= userDao.findByToken(token);
        if(user==null || !user.isAdmin()){
            return Response.status(200).entity("Não tem permissões para esta ação").build();
        }
        CategoryEntity c = categoryDao.createCategory(category.getName());
        return Response.status(200).entity("Categoria criada com sucesso!").build();

    }

    @GET
    @Path("/all")
    public Response allCategories() {
        return Response.status(200).entity(categoryDao.findAll()).build();
    }
}

