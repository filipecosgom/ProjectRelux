package aor.paj.service;

import aor.paj.dao.CategoryDao;
import aor.paj.entity.CategoryEntity;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Stateless
public class CategoryService {
    @Inject
    private CategoryDao categoryDao;
    @Inject
    private CategoryService categoryService;

    @Path("/categories")
    @Produces (MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public class Categories {

        @POST
        public Response createCategory(CategoryEntity category) {
            CategoryEntity c1 = categoryService.cre
        }
    }
}
