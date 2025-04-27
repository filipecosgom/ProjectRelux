// filepath: backend/src/main/java/aor/paj/dao/SettingsDao.java
package aor.paj.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import aor.paj.entity.SettingsEntity;

@Stateless
public class SettingsDao extends AbstratDao<SettingsEntity> {
    public SettingsDao() {
        super(SettingsEntity.class);
    }

    public String getSettingValue(String key) {
        try {
            return em.createQuery("SELECT s.value FROM SettingsEntity s WHERE s.key = :key", String.class)
                     .setParameter("key", key)
                     .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public void updateSetting(String key, String value) {
        SettingsEntity setting = em.createQuery("SELECT s FROM SettingsEntity s WHERE s.key = :key", SettingsEntity.class)
                                   .setParameter("key", key)
                                   .getSingleResult();
        if (setting != null) {
            setting.setValue(value);
            em.merge(setting);
        }
    }

    public void updateSetting(String key, int value) {
        SettingsEntity setting = em.createQuery("SELECT s FROM SettingsEntity s WHERE s.key = :key", SettingsEntity.class)
                                   .setParameter("key", key)
                                   .getSingleResult();
        if (setting != null) {
            setting.setValue(String.valueOf(value)); // Converte o inteiro para string antes de armazenar
            em.merge(setting);
        }
    }
}