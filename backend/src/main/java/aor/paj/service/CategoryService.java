package aor.paj.service;

import aor.paj.bean.CategoryBean;
import aor.paj.dao.CategoryDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.CategoryDto;
import aor.paj.entity.CategoryEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;

@Stateless


@Path("/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CategoryService {

    @Inject
    private CategoryDao categoryDao;

    @Inject
    CategoryBean categoryBean;

    @Inject
    private UserDao userDao;

    @POST
    @Path("/new")
    public Response createCategory(@HeaderParam("Authorization") String token, CategoryEntity category) {
        UserEntity user = userDao.findByToken(token);
        if (user == null || !user.isAdmin()) {
            return Response.status(200).entity("Não tem permissões para esta ação").build();
        }
        CategoryEntity c = categoryDao.createCategory(category.getName());
        return Response.status(200).entity("Categoria criada com sucesso!").build();

    }

    @GET
    @Path("/all")
    public Response allCategories() {
        ArrayList<CategoryDto> categories = categoryBean.getAllCategories();
        return Response.status(200).entity(categories).build();
    }


    @GET
    @Path("/{categoryId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCategoryById(@PathParam("categoryId") int categoryId) {
        System.out.println("Buscando categoria com ID: " + categoryId);
        CategoryEntity category = categoryDao.findById(categoryId);
        if (category == null) {
            System.out.println("Categoria não encontrada para ID: " + categoryId);
            return Response.status(Response.Status.NOT_FOUND).entity("Categoria não encontrada").build();
        }
        System.out.println("Categoria encontrada: " + category.getName());

        // Converte a entidade para DTO
        CategoryDto categoryDto = new CategoryDto(category.getId(), category.getName());
        return Response.ok(categoryDto).build();
    }

    @PUT
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCategory(
            @HeaderParam("Authorization") String token,
            @PathParam("id") int id,
            CategoryDto categoryDto
    ) {
        // Verifica se o token é válido e se o utilizador é administrador
        UserEntity user = userDao.findByToken(token);
        if (user == null || !user.isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN).entity("Você não tem permissões para esta ação.").build();
        }

        // Busca a categoria pelo ID
        CategoryEntity category = categoryDao.findById(id);
        if (category == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Categoria não encontrada.").build();
        }

        // Atualiza o nome da categoria
        category.setName(categoryDto.getNome());
        categoryDao.update(category);

        return Response.status(Response.Status.OK).entity("Categoria atualizada com sucesso!").build();
    }


    @DELETE
    @Path("/{id}")
    public Response deleteCategory(@HeaderParam("Authorization") String token, @PathParam("id") int id) {
        UserEntity user = userDao.findByToken(token);
        if (user == null || !user.isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN).entity("Você não tem permissões para esta ação de apagar categoria.").build();
        }

        CategoryEntity category = categoryDao.findById(id);
        if (category == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Categoria não encontrada.").build();
        }

        categoryDao.deleteCategory(id);
        return Response.status(Response.Status.OK).entity("Categoria apagada com sucesso!").build();
    }
}



