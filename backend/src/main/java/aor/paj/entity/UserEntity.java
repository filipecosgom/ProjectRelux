package aor.paj.entity;

import jakarta.persistence.*;
import org.mindrot.jbcrypt.BCrypt;

import java.io.Serializable;
import java.util.List;


@Entity
@Table(name = "utilizador")
@NamedQuery(name = "Utilizador.findUserByUsername", query = "SELECT u FROM UserEntity u WHERE u.username = :username")
@NamedQuery(name = "Utilizador.findUserByToken", query = "SELECT DISTINCT u FROM UserEntity u WHERE u.token = :token")
@NamedQuery(name= "Utilizador.getAllUsers", query= "SELECT u FROM UserEntity u ORDER BY id ASC")
@NamedQuery(name= "Utilizador.getDeletedUsers", query= "SELECT u FROM UserEntity u WHERE u.isDeleted = true")


public class UserEntity implements Serializable {

    //user unique id has ID - not updatable, unique, not null
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private int id;

    @Column(name = "username", nullable = false, unique = false, updatable = true)
    private String username;

    @Column(name = "password", nullable = false, unique = false, updatable = true)
    private String password;

    //user's name
    @Column(name = "firstName", nullable = false, unique = false, updatable = true)
    private String firstName;

    @Column(name = "lastName", nullable = false, unique = false, updatable = true)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true, updatable = true)
    private String email;

    @Column(name = "telefone", nullable = false, unique = false, updatable = true)
    private String phone;

    @Column(name = "token", nullable = true, unique = true, updatable = true)
    private String token;

    @Column(name = "imagem", nullable = true, unique = false, updatable = true)
    private String imagem;

    @Column(name = "isAdmin", nullable = false, unique = false)
    private boolean isAdmin;

    @Column(name ="isDeleted", nullable= false, unique = false)
    private boolean isDeleted;

    @Column(name = "isVerified", nullable = false)
    private boolean isVerified; // Indica se a conta foi verificada

    @Column(name = "verificationToken", nullable = true, unique = true)
    private String verificationToken; // Armazena o token de verificação

    @Column(name = "password_recovery_token", nullable = true, unique = true)
    private String passwordRecoveryToken;
    
    @OneToMany (mappedBy = "userAutor")
    private List<ProductEntity> products;

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

    public boolean checkPassword(String plainPassword) {
        return BCrypt.checkpw(plainPassword, this.password);
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
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
    public boolean isAdmin() {
        return isAdmin;
    }
    public UserEntity setIsAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
        return this;
    }
    public List<ProductEntity> getProducts() {
        return products;
    }
    public void setProducts(List<ProductEntity> products) {
        this.products = products;
    }

    public UserEntity setAdmin(boolean admin) {
        isAdmin = admin;
        return this;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public UserEntity setDeleted(boolean deleted) {
        isDeleted = deleted;
        return this;
    }

    public boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    public String getPasswordRecoveryToken() {
    return passwordRecoveryToken;
}

    public void setPasswordRecoveryToken(String passwordRecoveryToken) {
    this.passwordRecoveryToken = passwordRecoveryToken;
}
}
