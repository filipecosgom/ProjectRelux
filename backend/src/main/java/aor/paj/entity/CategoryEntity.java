package aor.paj.entity;


import java.io.Serializable;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name="user_be")
@NamedQuery(name = "", query = "SELECT u FROM UserEntity u WHERE u.username = :username")
@NamedQuery(name = "", query = "SELECT u FROM UserEntity u WHERE u.email = :email")
@NamedQuery(name = "", query = "SELECT DISTINCT u FROM UserEntity u WHERE u.token = :token")
public class CategoryEntity implements Serializable {
    private static final long serialVersionUID = 1L;


}
