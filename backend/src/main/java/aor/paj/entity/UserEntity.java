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
    private String nome;

    @Column(name = "email", nullable = false, unique = true, updatable = false)
    private String email;

    @Column(name = "telefone", nullable = false, unique = true, updatable = false)
    private String telefone;

    @Column(name = "token", nullable = true, unique = true, updatable = true)
    private String token;


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

    public String getNome() {
        return nome;
    }

    public void setName(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
