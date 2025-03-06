package aor.paj.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import aor.paj.bean.ProductBean;
import aor.paj.bean.UserBean;
import aor.paj.dto.ProductDto;
//import aor.paj.bean.ProductBean;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

//Gere os endpoints do produto
@Path("/products")
public class ProductService {

    @Inject
    ProductBean productBean;
    @Inject
    UserBean userBean;

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProducts(@HeaderParam("Authorization") String token) {
        if (token == null || token.isEmpty()) {
            List<ProductDto> products = productBean.getAllProducts();
            return Response.ok(products).build();
        }
        UserEntity user = userBean.getUserByToken(token);
        if (user == null) {
            return Response.status(200).entity("Token inválido").build();
        }
        if (user.isAdmin()) {
            List<ProductDto> products = productBean.getAllProducts();
            return Response.ok(products).build();
        } else {
            List<ProductDto> products = productBean.getProductsByUser(user);
            return Response.ok(products).build();
        }
    }


    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductById(@PathParam("id") int id) {
        ProductDto productDto = productBean.getProductById(id);
        return productDto == null ? Response.status(200).entity("Produto não encontrado!").build()
                : Response.ok(productDto).build();
    }

    @GET
    @Path("/details")
    public Response getProductDetails(@QueryParam("id") String productId) {
        if (productId == null || productId.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Product ID is required").build();
        }
        return Response.seeOther(URI.create("/detalhes-produto.html?id=" + productId)).build();
    }

    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addProduct(@HeaderParam("Authorization") String token, ProductDto productDto) {
        if (userBean.tokenExist(token)) {
            boolean sucess = productBean.addProduct(token, productDto);
            if (sucess) {
                return Response.status(200).entity("Produto criado com sucesso!").build();
            } else {
                return Response.status(401).entity("Erro ao adicionar produto.").build();
            }
        }
        return Response.status(404).entity("Token inválido").build();
    }

    @DELETE
    @Path("/soft-delete/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response softDeleteProduct(@HeaderParam("Authorization") String token, @PathParam("id") int id) {
        if (!userBean.tokenExist(token)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
        }

        UserEntity user = userBean.getUserByToken(token);
        if (user == null || !user.isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN).entity("Sem permissões para esta ação").build();
        }

        ProductDto product = productBean.getProductById(id);
        if (product == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Produto não encontrado").build();
        }

        boolean success = productBean.softDeleteProduct(id);
        if (success) {
            return Response.status(Response.Status.OK).entity("Produto apagado com sucesso!").build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao apagar o produto").build();
        }
    }


    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteProduct(@HeaderParam("Authorization") String token, @PathParam("id") int id) {
        if (!userBean.tokenExist(token)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
        }

        UserEntity user = userBean.getUserByToken(token);
        if (user == null || !user.isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN).entity("Só é permitido a administradores").build();
        }

        ProductDto product = productBean.getProductById(id);
        if (product == null) {
            return Response.status(404).entity("Produto não encontrado!").build();
        }

        boolean success = productBean.deleteProduct(id);
        if (success) {
            return Response.status(200).entity("Produto eliminado com sucesso").build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao apagar o produto").build();
        }
    }


    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProduct(@HeaderParam("Authorization") String token, @PathParam("id") int id, ProductDto productDto) {
        if (!userBean.tokenExist(token)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
        }

        UserEntity user = userBean.getUserByToken(token);
        ProductDto product = productBean.getProductById(id);

        if (product == null || (!user.isAdmin() && product.getUserAutor().equals(user.getUsername()))) {
            return Response.status(404).entity("Não tem permissões para alterar os dados.").build();
        }

        boolean success = productBean.updateProduct(id, productDto);
        if (success) {
            return Response.status(200).entity("Produto atualizado com sucesso!").build();
        } else {
            return Response.status(401).entity("Produto não encontrado!").build();
        }
    }

    @PUT
    @Path("/update-state/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProductState(@HeaderParam("Authorization") String token, @PathParam("id") int id, ProductDto productDto) {
        if (!userBean.tokenExist(token)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
        }

        UserEntity user = userBean.getUserByToken(token);
        ProductDto product = productBean.getProductById(id);

        if (product == null || !product.getUserAutor().equals(user.getUsername())) {
            return Response.status(Response.Status.FORBIDDEN).entity("Você não tem permissão para alterar o estado deste produto.").build();
        }

        boolean success = productBean.updateProductState(id, productDto.getState());
        if (success) {
            return Response.status(Response.Status.OK).entity("Estado do produto atualizado com sucesso!").build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Produto não encontrado!").build();
        }
    }

    @GET
    @Path("/user-products/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductsByUser(@HeaderParam("Authorization") String token, @PathParam("username") String username) {
        UserEntity loggedInUser = userBean.getUserByToken(token);
        if (loggedInUser == null || !loggedInUser.isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN).entity("Você não tem permissão para acessar este recurso.").build();
        }

        UserEntity user = userBean.getUserByUsername(username);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Utilizador não encontrado").build();
        }

        List<ProductDto> products = productBean.getProductsByUser(user);
        return Response.status(Response.Status.OK).entity(products).build();
    }


        @GET
        @Path("/category/{categoryId}")
        @Produces(MediaType.APPLICATION_JSON)
        public Response getProductsByCategory(@HeaderParam("Authorization") String token, @PathParam("categoryId") int categoryId) {
            UserEntity loggedInUser = userBean.getUserByToken(token);
            if (loggedInUser == null || !loggedInUser.isAdmin()) {
                return Response.status(Response.Status.FORBIDDEN).entity("Você não tem permissão para acessar este recurso.").build();
            }

            List<ProductDto> products = productBean.getProductsByCategory(categoryId);
            return Response.status(Response.Status.OK).entity(products).build();
        }
}


