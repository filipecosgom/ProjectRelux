package aor.paj.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import aor.paj.bean.ProductBean;
import aor.paj.bean.UserBean;
import aor.paj.dto.ProductDto;
//import aor.paj.bean.ProductBean;
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
    public Response getAllProducts() {
      //  List<ProductDto> products = productBean.getAllProducts();
      //  return Response.ok(products).build();
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
        if(userBean.tokenExist(token)) {
            ArrayList<ProductDto> products= productBean.getProducts(token);
        }
        return Response.status(Response.Status.CREATED).entity(productDto).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProduct(@PathParam("id") String id, ProductDto productDto) {
        ProductDto existingProduct = productBean.getProductById(id);
        if (existingProduct == null) {
            return Response.status(404).entity("Product not found!").build();
        }
        productDto.setId(id);
        productBean.updateProduct(productDto);
        return Response.ok(productDto).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public Response deleteProduct(@PathParam("id") String id) {
        ProductDto existingProduct = productBean.getProductById(id);
        if (existingProduct == null) {
            return Response.status(404).entity("Product not found!").build();
        }
        productBean.deleteProduct(id);
        return Response.noContent().build();
    }
}
