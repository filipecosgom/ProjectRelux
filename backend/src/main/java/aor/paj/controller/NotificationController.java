package aor.paj.controller;

import aor.paj.dao.NotificationDao;
import aor.paj.entity.NotificationEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDateTime;
import java.util.List;

@Path("/notifications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class NotificationController {

    @Inject
    private NotificationDao notificationDao;

    @GET
    @Path("/{recipient}")
    public List<NotificationEntity> getNotifications(@PathParam("recipient") String recipient) {
        return notificationDao.findByRecipient(recipient);
    }

    @POST
    public Response createNotification(NotificationEntity notification) {
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        notificationDao.persist(notification);
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    public Response markAsRead(@PathParam("id") int id) {
        NotificationEntity notification = notificationDao.find(id);
        if (notification != null) {
            notification.setRead(true);
            notificationDao.merge(notification);
            return Response.ok().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }
}