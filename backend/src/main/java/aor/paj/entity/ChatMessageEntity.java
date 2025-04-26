package aor.paj.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * Entity representing a chat message.
 */
@Entity
@Table(name = "chat_messages")
public class ChatMessageEntity implements Serializable {

    private static final long serialVersionUID = 1L; // Add a serialVersionUID for serialization

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Explicitly map to the "id" column
    private int id;

    @Column(name = "sender", nullable = false) // Explicitly map to the "sender" column
    private String sender;

    @Column(name = "recipient", nullable = false) // Explicitly map to the "recipient" column
    private String recipient;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT") // Explicitly map to the "content" column
    private String content;

    @Column(name = "timestamp", nullable = false) // Explicitly map to the "timestamp" column
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    @Column(name = "is_read", nullable = false) // Explicitly map to the "is_read" column
    private boolean isRead;

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }
}