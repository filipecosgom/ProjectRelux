package aor.paj.pojo;

public class UserPojo {

    private String username;
    private String password;
    private String primeiro_nome;
    private String ultimo_nome;
    private String email;
    private String telefone;
    /*private String imagem;*/

    public UserPojo(String username, String password, String primeiro_nome, String ultimo_nome, String email, String telefone) {
        this.username = username;
        this.password = password;
        this.primeiro_nome = primeiro_nome;
        this.ultimo_nome = ultimo_nome;
        this.email = email;
        this.telefone = telefone;
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
}





