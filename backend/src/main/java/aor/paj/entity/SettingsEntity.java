// filepath: backend/src/main/java/aor/paj/entity/SettingsEntity.java
package aor.paj.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "settings")
public class SettingsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "key", unique = true, nullable = false)
    private String key;

    @Column(name = "value", nullable = false)
    private String value;

    // Getters e Setters
}