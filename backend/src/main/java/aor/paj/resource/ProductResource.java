package aor.paj.resource;

import aor.paj.service.ProductService;
import aor.paj.dto.ProductDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/products")
public class ProductResource {

    @Inject
    ProductService productService;

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProducts() {
        List<ProductDto> products = productService.getAllProducts();
        return Response.ok(products).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductById(@PathParam("id") String id) {
        ProductDto productDto = productService.getProductById(id);
        return productDto == null ?
                Response.status(200).entity("Produto não encontrado!").build() :
                Response.ok(productDto).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addProduct(ProductDto productDto) {
        productService.addProduct(productDto);
        return Response.status(Response.Status.CREATED).entity(productDto).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProduct(@PathParam("id") String id, ProductDto productDto) {
        ProductDto existingProduct = productService.getProductById(id);
        if (existingProduct == null) {
            return Response.status(404).entity("Product not found!").build();
        }
        productDto.setId(id); // Ensure the ID remains the same
        productService.updateProduct(productDto);
        return Response.ok(productDto).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public Response deleteProduct(@PathParam("id") String id) {
        ProductDto existingProduct = productService.getProductById(id);
        if (existingProduct == null) {
            return Response.status(404).entity("Product not found!").build();
        }
        productService.deleteProduct(id);
        return Response.noContent().build();
    }
}
