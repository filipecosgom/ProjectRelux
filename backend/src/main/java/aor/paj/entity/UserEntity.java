package aor.paj.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "utilizador")
@NamedQuery(name = "Utilizador.findUserByUsername", query = "SELECT u FROM UserEntity u WHERE u.username = :username")
@NamedQuery(name = "Utilizador.findUserByEmail", query = "SELECT u FROM UserEntity u WHERE u.email = :email")
@NamedQuery(name = "Utilizador.findUserByToken", query = "SELECT DISTINCT u FROM UserEntity u WHERE u.token = :token")

public class UserEntity implements Serializable {

    //user unique id has ID - not updatable, unique, not null
    @Id
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private int id;

    @Column(name = "username", nullable = false, unique = false, updatable = true)
    private String username;

    @Column(name = "password", nullable = false, unique = false, updatable = true)
    private String password;

    //user's name
    @Column(name = "name", nullable = false, unique = false, updatable = true)
    private String name;

    @Column(name = "email", nullable = false, unique = true, updatable = false)
    private String email;

    @Column(name = "telefone", nullable = false, unique = false, updatable = false)
    private String phone;

    @Column(name = "token", nullable = true, unique = true, updatable = true)
    private String token;

    @Column(name = "imagem", nullable = true, unique = false, updatable = true)
    private String imagem;

    @Column(name = "isAdmin", nullable = false, unique = false)
    private boolean isAdmin;

    public UserEntity() {   // Public empty constructor

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getImagem() {
        return imagem;
    }

    public UserEntity setImagem(String imagem) {
        this.imagem = imagem;
        return this;
    }

    public UserEntity setIsAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
        return this;
    }
}
