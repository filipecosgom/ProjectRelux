package aor.paj.service;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.json.Json;
import jakarta.json.JsonObject;

/**
 * WebSocket endpoint for real-time product updates.
 */
@ServerEndpoint("/product/{productId}")
public class ProductWebSocket {

    // Stores all active WebSocket sessions mapped by productId
    private static final Map<String, Session> productSessions = new ConcurrentHashMap<>();

    /**
     * Called when a new WebSocket connection is established.
     *
     * @param session   The WebSocket session.
     * @param productId The ID of the product being viewed.
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("productId") String productId) {
        productSessions.putIfAbsent(productId, session);
        System.out.println("User connected to product " + productId);
    }

    /**
     * Called when a WebSocket connection is closed.
     *
     * @param session   The WebSocket session.
     * @param productId The ID of the product being viewed.
     */
    @OnClose
    public void onClose(Session session, @PathParam("productId") String productId) {
        productSessions.remove(productId);
        System.out.println("User disconnected from product " + productId);
    }

    /**
     * Sends an update to all users viewing a specific product.
     *
     * @param productId The ID of the product being updated.
     * @param update    The update to send.
     */
    public static void sendProductUpdate(String productId, JsonObject update) {
        Session session = productSessions.get(productId);
        if (session != null && session.isOpen()) {
            try {
                session.getBasicRemote().sendText(update.toString());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}