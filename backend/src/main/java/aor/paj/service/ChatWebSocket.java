package aor.paj.service;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import aor.paj.dao.ChatMessageDao;
import aor.paj.entity.ChatMessageEntity;
import jakarta.inject.Inject;

/**
 * WebSocket endpoint for real-time chat communication.
 */
@ServerEndpoint("/chat/{username}")
public class ChatWebSocket {

    // Stores all active WebSocket sessions mapped by username
    private static final Map<String, Session> sessions = new ConcurrentHashMap<>();

    @Inject
    private ChatMessageDao chatMessageDao; // Injeta o DAO para salvar mensagens

    /**
     * Called when a new WebSocket connection is established.
     *
     * @param session  The WebSocket session.
     * @param username The username of the connected user.
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("username") String username) {
        System.out.println("Tentando conectar: " + username);
        sessions.put(username, session); // Add the user to the active sessions
        System.out.println(username + " connected to the chat.");
    }

    /**
     * Called when a message is received from a client.
     *
     * @param message  The message sent by the client.
     * @param username The username of the sender.
     */
@OnMessage
    public void onMessage(String message, @PathParam("username") String username) {
        System.out.println("Message from " + username + ": " + message);

        // Divide a mensagem no formato "recipient:message"
        String[] parts = message.split(":", 2);
        if (parts.length == 2) {
            String recipient = parts[0].trim();
            String chatMessage = parts[1].trim();

            // Salva a mensagem na base de dados
            ChatMessageEntity chatMessageEntity = new ChatMessageEntity();
            chatMessageEntity.setSender(username);
            chatMessageEntity.setRecipient(recipient);
            chatMessageEntity.setContent(chatMessage);
            chatMessageEntity.setTimestamp(LocalDateTime.now());
            chatMessageEntity.setRead(false); // Define como não lida inicialmente
            chatMessageDao.persist(chatMessageEntity); // Salva no banco de dados

            // Envia a mensagem para o destinatário, se ele estiver conectado
            Session recipientSession = sessions.get(recipient);
            if (recipientSession != null && recipientSession.isOpen()) {
                try {
                    recipientSession.getBasicRemote().sendText(username + ": " + chatMessage);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * Called when a WebSocket connection is closed.
     *
     * @param session  The WebSocket session.
     * @param username The username of the disconnected user.
     */
    @OnClose
    public void onClose(Session session, @PathParam("username") String username) {
        sessions.remove(username); // Remove the user from active sessions
        System.out.println(username + " disconnected from the chat.");
    }

    /**
     * Called when an error occurs during WebSocket communication.
     *
     * @param session The WebSocket session.
     * @param error   The error that occurred.
     */
    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }
}