// filepath: backend/src/main/java/aor/paj/entity/SettingsEntity.java
package aor.paj.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "settings")
public class SettingsEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "key", unique = true, nullable = false)
    private String key;

    @Column(name = "value", nullable = false)
    private String value;

    // Getters e Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}