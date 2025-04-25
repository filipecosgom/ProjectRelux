package aor.paj.dao;

import aor.paj.entity.NotificationEntity;
import jakarta.ejb.Stateless;

import java.util.List;

@Stateless
public class NotificationDao extends AbstratDao<NotificationEntity> {

    public NotificationDao() {
        super(NotificationEntity.class);
    }

    public List<NotificationEntity> findByRecipient(String recipient) {
        return em.createQuery("SELECT n FROM NotificationEntity n WHERE n.recipient = :recipient ORDER BY n.timestamp DESC", NotificationEntity.class)
                .setParameter("recipient", recipient)
                .getResultList();
    }
}