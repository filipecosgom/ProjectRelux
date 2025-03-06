package aor.paj.dao;
import aor.paj.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@Stateless
public class UserDao extends AbstratDao<UserEntity>{
    private static final long serialVersionUID = 1L;


    public UserDao() {
        super(UserEntity.class);
    }


    public UserEntity findByToken(String token) {
        try {
            return (UserEntity) em.createNamedQuery("Utilizador.findUserByToken").setParameter("token", token)
                    .getSingleResult();

        } catch (NoResultException e) {
            return null;
        }
    }


    public UserEntity findUserByUsername(String username) {
        try {
            return (UserEntity) em.createNamedQuery("Utilizador.findUserByUsername").setParameter("username", username)
                    .getSingleResult();

        } catch (NoResultException e) {
            return null;
        }
    }

    public List<UserEntity> findDeletedUsers() {
        try {
            return em.createNamedQuery("Utilizador.findDeeletedUseres", UserEntity.class).getResultList();
        } catch (NoResultException e) {
            return null;
        }
    }

    public List<UserEntity> findAll() {
        try {
            return em.createNamedQuery("Utilizador.findAllUsers", UserEntity.class).getResultList();
        } catch (NoResultException e) {
            return null;
        }
    }
}
