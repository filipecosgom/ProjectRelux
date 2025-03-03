package aor.paj.service;

import aor.paj.dao.CategoryDao;
import aor.paj.entity.CategoryEntity;
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

    @POST
    @Path("new")
    public Response createCategory(CategoryEntity category) {
        CategoryEntity c1 = categoryDao.createCategory(category.getName());
        return Response.status(200).entity("Nova Categoria criada").build();
    }

    @GET
    @Path("all")
    public Response allCategories(CategoryEntity category) {
        CategoryEntity c1 = categoryDao.createCategory(category.getName());
        return Response.status(200).entity("Nova Categoria criada").build();
    }
}

