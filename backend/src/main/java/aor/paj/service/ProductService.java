package aor.paj.service;

import aor.paj.bean.ProductBean;
import aor.paj.dto.ProductDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/product")
public class ProductService {

    @Inject
    ProductBean productBean;

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<ProductDto> getProducts() {
        return productBean.getProducts();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductById(@PathParam("id") String id) {
        ProductDto productDto = productBean.getProductById(id);
        return productDto == null ?
                Response.status(200).entity("Produto não encontrado!").build() :
                Response.ok(productDto).build();
    }
}
