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
    public Response getAllProducts(@HeaderParam("token") String token) {
        if (userBean.tokenExist(token)) {
            List<ProductDto> products = productBean.getAllProducts(token);
            return Response.ok(products).build();
        } else {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
        }
    }


    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductById(@PathParam("id") String id) {
        ProductDto productDto = productBean.getProductById(id);
        return productDto == null ? Response.status(200).entity("Produto não encontrado!").build()
                : Response.ok(productDto).build();
    }

    @GET
    @Path("/details")
    public Response getProductDetails(@QueryParam("id") String productId) {
        return Response.seeOther(URI.create("/detalhes-produto.html?id=" + productId)).build();
    }

    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addProduct(@HeaderParam("token") String token, ProductDto productDto) {
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
    public Response softDeleteProduct(@HeaderParam("token") String token, @PathParam("id") String id) {
        if (!userBean.tokenExist(token)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
        }

        boolean success = productBean.softDeleteProduct(id);
        if (success) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Produto não encontrado!").build();
        }
    }
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteProduct(@HeaderParam("token") String token, @PathParam("id") String id) {
        if (!userBean.tokenExist(token)) {
            return Response.status(200).entity("Não autorizado. Só é permitido a administradores").build();
        } else {
            return Response.status(401).entity("Produto não encontrado").build();
        }
    }


    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProduct(@HeaderParam("token") String token, @PathParam("id") String id, ProductDto productDto) {
        if (!userBean.tokenExist(token)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Token inválido").build();
        }

        UserEntity user = userBean.getUserByToken(token);
        ProductDto product = productBean.getProductById(id);

        if (product == null || !product.getUserAutor().equals(user)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Você não tem permissão para atualizar este produto.").build();
        }

        boolean success = productBean.updateProduct(id, productDto);
        if (success) {
            return Response.status(Response.Status.OK).entity("Produto atualizado com sucesso!").build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Produto não encontrado!").build();
        }
    }
}


