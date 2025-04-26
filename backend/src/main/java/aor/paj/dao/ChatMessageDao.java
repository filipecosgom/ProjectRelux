package aor.paj.dao;

import aor.paj.entity.ChatMessageEntity;
import jakarta.ejb.Stateless;

import java.util.List;

@Stateless
public class ChatMessageDao extends AbstratDao<ChatMessageEntity> {

    public ChatMessageDao() {
        super(ChatMessageEntity.class);
    }

    /**
     * Finds all messages between two users.
     *
     * @param sender    The sender's username.
     * @param recipient The recipient's username.
     * @return A list of chat messages.
     */
    public List<ChatMessageEntity> findMessagesBetweenUsers(String sender, String recipient) {
        return em.createQuery(
                "SELECT m FROM ChatMessageEntity m WHERE " +
                        "(m.sender = :sender AND m.recipient = :recipient) OR " +
                        "(m.sender = :recipient AND m.recipient = :sender) " +
                        "ORDER BY m.timestamp ASC", ChatMessageEntity.class)
                .setParameter("sender", sender)
                .setParameter("recipient", recipient)
                .getResultList();
    }

    /**
     * Marks all messages as read for a specific recipient.
     *
     * @param recipient The recipient's username.
     * @return The number of messages updated.
     */
    public int markAllAsRead(String recipient) {
        return em.createQuery(
                "UPDATE ChatMessageEntity m SET m.isRead = true WHERE m.recipient = :recipient AND m.isRead = false"
            )
            .setParameter("recipient", recipient)
            .executeUpdate();
    }
}