package aor.paj.service;

import aor.paj.dao.SettingsDao;
import aor.paj.dao.UserDao;
import aor.paj.dao.ProductDao;
import aor.paj.dao.CategoryDao;
import aor.paj.entity.UserEntity;
import aor.paj.bean.UserBean;
import aor.paj.dto.CategoryDto;
import aor.paj.dto.UserProductStatsDto;
import aor.paj.dto.TimeSeriesDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;
import java.util.List;

@Path("/admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminService {

    @Inject
    private SettingsDao settingsDao;

    @Inject
    private UserBean userBean;

    @Inject
    private UserDao userDao;

    @Inject
    private ProductDao productDao;

    @Inject
    private CategoryDao categoryDao;

    @PUT
    @Path("/settings/session-timeout")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateSessionTimeout(@HeaderParam("Authorization") String token, Map<String, Object> body) {
        // Verifica se o usuário é administrador
        if (!isAdmin(token)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Acesso negado.").build();
        }

        try {
            // Extrai o valor de timeout do corpo da requisição
            int timeoutValue = (int) body.get("timeout");

            // Atualiza o tempo de expiração no banco de dados
            settingsDao.updateSetting("session_timeout", String.valueOf(timeoutValue));
            return Response.ok("Tempo de expiração atualizado com sucesso.").build();
        } catch (ClassCastException | NullPointerException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("O valor de timeout deve ser um número inteiro.")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao atualizar o tempo de expiração.")
                    .build();
        }
    }

    @GET
    @Path("/settings/session-timeout")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSessionTimeout(@HeaderParam("Authorization") String token) {
        // Verifica se o usuário é administrador
        if (!isAdmin(token)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Acesso negado.").build();
        }

        try {
            String timeoutValue = settingsDao.getSettingValue("session_timeout");
            return Response.ok("{\"timeout\": " + timeoutValue + "}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao obter o tempo de expiração.")
                    .build();
        }
    }

    @GET
    @Path("/stats/users")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserStats() {
        long totalUsers = userDao.countAllUsers();
        long verifiedUsers = userDao.countVerifiedUsers();

        return Response.ok("{\"totalUsers\": " + totalUsers + ", \"verifiedUsers\": " + verifiedUsers + "}").build();
    }

    @GET
    @Path("/stats/products")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductStats() {
        Map<String, Long> productStats = productDao.countProductsByState();

        return Response.ok(productStats).build();
    }

    @GET
    @Path("/stats/categories")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCategoryStats() {
        List<CategoryDto> categories = categoryDao.getCategoriesByProductCount();

        return Response.ok(categories).build();
    }

    @GET
    @Path("/stats/products-by-user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductsByUser() {
        List<UserProductStatsDto> stats = userDao.getProductsByUser();

        return Response.ok(stats).build();
    }

    @GET
    @Path("/stats/average-time-to-purchase")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAverageTimeToPurchase() {
        double averageTime = productDao.calculateAverageTimeToPurchase();

        return Response.ok("{\"averageTimeToPurchase\": " + averageTime + "}").build();
    }

    @GET
    @Path("/stats/registered-users-over-time")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRegisteredUsersOverTime() {
        List<TimeSeriesDto> data = userDao.getRegisteredUsersOverTime();

        return Response.ok(data).build();
    }

    @GET
    @Path("/stats/purchased-products-over-time")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPurchasedProductsOverTime() {
        List<TimeSeriesDto> data = productDao.getPurchasedProductsOverTime();

        return Response.ok(data).build();
    }

    private boolean isAdmin(String token) {
        UserEntity loggedInUser = userBean.getUserByToken(token);
        return loggedInUser != null && loggedInUser.isAdmin();
    }
}
