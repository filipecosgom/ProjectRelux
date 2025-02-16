package aor.paj.resource;

import aor.paj.service.ProductService;
import aor.paj.dto.ProductDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
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
    public List<ProductDto> getProducts() {
        return productService.getProducts();
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
}
