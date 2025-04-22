package aor.paj.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@XmlRootElement
public class UserDto {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String imagem;
    private List<String> produtos;
    private int id;
    private boolean isAdmin;
    private boolean isDeleted;
    private boolean isVerified; // Adicionado
    private String verificationToken; // Adicionado
    private String passwordRecoveryToken; // Adicionado
    private boolean canEdit; // Adicionado

    public UserDto() {
        this.produtos = new ArrayList<>();
    }

    public UserDto(String username, String password, String firstName, String lastName, String email,
                   String phone, String imagem, List<String> produtos, int id, boolean isAdmin, boolean isDeleted,
                   boolean isVerified, String verificationToken, String passwordRecoveryToken) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.imagem = imagem;
        this.produtos = (produtos != null) ? produtos : new ArrayList<>();
        this.id = id;
        this.isAdmin = isAdmin;
        this.isDeleted = isDeleted;
        this.isVerified = isVerified; // Adicionado
        this.verificationToken = verificationToken; // Adicionado
        this.passwordRecoveryToken = passwordRecoveryToken; // Adicionado
    }

    @XmlElement
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @XmlElement
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @XmlElement
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @XmlElement
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @XmlElement
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @XmlElement
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @XmlElement
    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    @XmlElement
    public List<String> getProdutos() {
        return produtos;
    }

    public void setProdutos(List<String> produtos) {
        this.produtos = produtos;
    }

    @XmlElement
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @XmlElement
    public boolean getIsAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    @XmlElement
    public boolean getIsDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    @XmlElement
    public boolean isVerified() {
        return isVerified;
    }

    public void setIsVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    @XmlElement
    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    @XmlElement
    public String getPasswordRecoveryToken() {
        return passwordRecoveryToken;
    }

    public void setPasswordRecoveryToken(String passwordRecoveryToken) {
        this.passwordRecoveryToken = passwordRecoveryToken;
    }

    @XmlElement
    public boolean isCanEdit() {
    return canEdit;
    }

    public void setCanEdit(boolean canEdit) {
    this.canEdit = canEdit;
    }
}

