package aor.paj.service;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/notifications/{username}")
public class NotificationWebSocket {
    private static final ConcurrentHashMap<String, Session> sessions = new ConcurrentHashMap<>();

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

    public static void sendNotification(String username, String message) {
        Session session = sessions.get(username);
        if (session != null && session.isOpen()) {
            try {
                session.getBasicRemote().sendText(message);
                System.out.println("Notificação enviada para " + username + ": " + message);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Erro ao enviar notificação para " + username + ": " + e.getMessage());
            }
        }
    }
}