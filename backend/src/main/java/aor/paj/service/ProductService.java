package aor.paj.service;

import java.net.URI;
import java.util.List;

import aor.paj.bean.ProductBean;
import aor.paj.bean.UserBean;
import aor.paj.dto.EstadosDoProduto;
import aor.paj.dto.ProductDto;
import aor.paj.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
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
    @Path("")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProducts(@HeaderParam("Authorization") String token, @QueryParam("state") String state) {
        List<ProductDto> products;

        // Se o estado for fornecido, filtrar os produtos com base no estado
        if (state != null && !state.isEmpty()) {
            try {
                EstadosDoProduto estado = EstadosDoProduto.valueOf(state.toUpperCase());
                products = productBean.getProductsByState(estado);
            } catch (IllegalArgumentException e) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Estado inválido: " + state)
                        .build();
            }
        } else {
            // Se o estado não for fornecido, seguir a lógica existente
            if (token == null || token.isEmpty()) {
                products = productBean.getAllProducts();
            } else {
                UserEntity user = userBean.getUserByToken(token);
                if (user == null) {
                    return Response.status(401).entity("Token inválido").build();
                }
                if (user.isAdmin()) {
                    products = productBean.getAllProducts();
                } else {
                    products = productBean.getProductsByUser(user);
                }
            }
        }

        return Response.ok(products).build();
    }


    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductById(@PathParam("id") int id) {
        ProductDto productDto = productBean.getProductById(id);
        return productDto == null ? Response.status(404).entity("Produto não encontrado!").build()
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
            // Envia a notificação via WebSocket
            JsonObject update = Json.createObjectBuilder()
                .add("id", id)
                .add("title", productDto.getTitle())
                .add("price", productDto.getPrice())
                .add("description", productDto.getDescription())
                .add("imagem", productDto.getImagem()) // Adiciona o campo imagem
                .add("local", productDto.getLocal()) // Adiciona o campo local
                .add("state", productDto.getState().toString()) // Converte para String
                .add("category_id", productDto.getCategoryId()) // Adiciona o campo category_id
                .add("user_id", productDto.getUserId()) // Adiciona o campo user_id
                .build();

            ProductWebSocket.sendProductUpdate(String.valueOf(id), update);

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

        if (product == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Produto não encontrado!").build();
        }

// Permitir que qualquer utilizador altere o estado para "COMPRADO"
        if ("COMPRADO".equals(productDto.getState())) {
            boolean success = productBean.updateProductState(id, productDto.getState());
            if (success) {
                return Response.status(Response.Status.OK).entity("Estado do produto atualizado com sucesso!").build();
            } else {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao atualizar o estado do produto.").build();
            }
        }

// Para outras alterações, verificar se o utilizador é o autor do produto

        if (product.getUserAutor().equals(user.getUsername())) {
            System.out.println("User: " + user.getUsername());
            System.out.println("Product user: " + product.getUserAutor());
            return Response.status(Response.Status.FORBIDDEN).entity("Você está a tentar alterar o estado de um produto que é seu.").build();
        }

        boolean success = productBean.updateProductState(id, productDto.getState());
        if (success) {
            return Response.status(Response.Status.OK).entity("Estado do produto atualizado com sucesso!").build();
        } else {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao atualizar o estado do produto.").build();
        }
    }

    @GET
    @Path("/user-products/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductsByUser(@HeaderParam("Authorization") String token, @PathParam("username") String username) {
        UserEntity loggedInUser = userBean.getUserByToken(token);
        if (loggedInUser == null || !loggedInUser.isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN).entity("Não tem permissões para esta ação").build();
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
    public Response getProductsByCategory(@PathParam("categoryId") int categoryId) {
        List<ProductDto> products = productBean.getProductsByCategory(categoryId);
        if (products == null || products.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).entity("Nenhum produto encontrado para esta categoria.").build();
        }
        return Response.status(Response.Status.OK).entity(products).build();
    }

    @GET
    @Path("/available")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllAvailableProducts() {
        // Obtém todos os produtos disponíveis
        List<ProductDto> availableProducts = productBean.getAvailableProducts();
        return Response.ok(availableProducts).build();
    }

    @GET
    @Path("/purchased")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPurchasedProducts() {
        // Obtém os produtos comprados do ProductBean
        List<ProductDto> purchasedProducts = productBean.getPurchasedProducts();
        return Response.ok(purchasedProducts).build();
    }
}


