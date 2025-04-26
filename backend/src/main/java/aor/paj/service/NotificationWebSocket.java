package aor.paj.service;

import jakarta.enterprise.inject.spi.CDI;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import java.util.concurrent.ConcurrentHashMap;
import aor.paj.dao.UserDao; // Import the UserDao class

@ServerEndpoint("/notifications/{username}")
public class NotificationWebSocket {

    private static final ConcurrentHashMap<String, Session> sessions = new ConcurrentHashMap<>();
    private static NotificationWebSocket instance; // Singleton instance

    public NotificationWebSocket() {
        instance = this; // Define a instância singleton
    }

    public static NotificationWebSocket getInstance() {
        return instance; // Retorna a instância singleton
    }

    @OnOpen
    public void onOpen(Session session, @PathParam("username") String username) {
        System.out.println("Conexão de notificação aberta para o usuário: " + username);
        sessions.put(username, session);
    }

    @OnClose
    public void onClose(Session session, @PathParam("username") String username) {
        System.out.println("Conexão de notificação fechada para o usuário: " + username);
        sessions.remove(username);
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.out.println("Erro no WebSocket de notificações: " + throwable.getMessage());
    }

    public void sendNotification(String username, String sender, String content, String timestamp) {
        Session session = sessions.get(username);
        if (session != null && session.isOpen()) {
            try {
                // Obter o UserDao manualmente usando CDI
                UserDao userDao = CDI.current().select(UserDao.class).get();

                // Buscar a imagem de perfil do remetente
                String senderImage = userDao.getUserImageByUsername(sender);

                // Se o remetente não tiver uma imagem, usar um placeholder
                if (senderImage == null || senderImage.isEmpty()) {
                    senderImage = "https://placehold.co/35x35/transparent/F00"; // URL de uma imagem padrão
                }

                // Construir o JSON manualmente
                String jsonMessage = String.format(
                    "{\"sender\":\"%s\", \"content\":\"%s\", \"timestamp\":\"%s\", \"senderImage\":\"%s\"}",
                    sender, content, timestamp, senderImage
                );

                // Enviar o JSON pelo WebSocket
                session.getBasicRemote().sendText(jsonMessage);
                System.out.println("Notificação enviada para " + username + ": " + jsonMessage);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Erro ao enviar notificação para " + username + ": " + e.getMessage());
            }
        }
    }
}