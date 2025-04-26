package aor.paj.controller;

import aor.paj.dao.ChatMessageDao;
import aor.paj.entity.ChatMessageEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.LocalDateTime;
import java.util.List;

@Path("/messages") // Define o caminho base para o endpoint
@Produces(MediaType.APPLICATION_JSON) // Define o formato de resposta como JSON
@Consumes(MediaType.APPLICATION_JSON) // Define o formato de entrada como JSON
public class ChatMessageController {

    @Inject
    private ChatMessageDao chatMessageDao; // Injeta o DAO para acessar o banco de dados

    /**
     * Endpoint para buscar mensagens entre dois usuários.
     *
     * @param sender    O remetente.
     * @param recipient O destinatário.
     * @return Lista de mensagens entre os dois usuários.
     */
    @GET
    @Path("/{sender}/{recipient}") // Define o caminho do endpoint
    public List<ChatMessageEntity> getMessagesBetweenUsers(
            @PathParam("sender") String sender, // Obtém o remetente da URL
            @PathParam("recipient") String recipient // Obtém o destinatário da URL
    ) {
        System.out.println("Buscando mensagens entre " + sender + " e " + recipient);
        return chatMessageDao.findMessagesBetweenUsers(sender, recipient);
    }

    @POST
    public void saveMessage(ChatMessageEntity message) {
        System.out.println("Recebendo mensagem para salvar: " + message.getContent());
        message.setTimestamp(LocalDateTime.now()); // Define o timestamp atual
        message.setRead(false); // Define como não lida inicialmente
        chatMessageDao.persist(message); // Salva a mensagem no banco de dados
    }

    @PUT
    @Path("/mark-as-read/{id}")
    public Response markMessageAsRead(@PathParam("id") int id) {
        System.out.println("Recebendo solicitação para marcar como lida a mensagem com ID: " + id);
        ChatMessageEntity message = chatMessageDao.find(id);
        if (message != null) {
            message.setRead(true);
            chatMessageDao.merge(message);
            System.out.println("Mensagem marcada como lida: " + id);
            return Response.ok().build();
        }
        System.out.println("Mensagem não encontrada: " + id);
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @PUT
    @Path("/mark-all-as-read/{recipient}")
    public Response markAllMessagesAsRead(@PathParam("recipient") String recipient) {
        System.out.println("Marcando todas as mensagens como lidas para o destinatário: " + recipient);
        int updatedCount = chatMessageDao.markAllAsRead(recipient);
        System.out.println("Total de mensagens marcadas como lidas: " + updatedCount);
        return Response.ok().build();
    }
}