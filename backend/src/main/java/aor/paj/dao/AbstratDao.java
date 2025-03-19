package aor.paj.dao;

import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaDelete;
import jakarta.persistence.criteria.CriteriaQuery;


import java.io.Serializable;
import java.util.List;

@TransactionAttribute(TransactionAttributeType.REQUIRED) //todos os métodos dentro desta classe vão ter um atributo de transação
public abstract class AbstratDao <T extends Serializable> implements Serializable {

    private static final long serialVersionUID = 1L; // define um identificador de versão da classe para garantir a compatibilidade
    private final Class<T> clazz; // vai armazenar a classe da entidade

    @PersistenceContext(unitName = "playAula") //injeta a persitência associada à unid. persistencia
    protected EntityManager em; //Define uma variável em do tipo EntityManager que será usada para interagir com o contexto de persistência.

    public AbstratDao(Class<T> clazz) {
        this.clazz = clazz;
    }

    public T find(Object id) {
        return em.find(clazz, id);
    }

    public void persist(final T entity) {
        em.persist(entity);
    }

    public void merge(final T entity) {
        em.merge(entity); //vai atualizar uma entidade existente na base de dados
    }

    public void remove(final T entity) {
        em.remove(entity);
    }

    public List<T> findAll() {
        System.out.println("Chega aqui");
        final CriteriaQuery<T> criteriaQuery = em.getCriteriaBuilder().createQuery(clazz);
        criteriaQuery.select(criteriaQuery.from(clazz));
        return em.createQuery(criteriaQuery).getResultList();
    }

    public void deleteAll() {
        final CriteriaDelete<T> criteriaDelete = em.getCriteriaBuilder().createCriteriaDelete(clazz);
        criteriaDelete.from(clazz);
        em.createQuery(criteriaDelete).executeUpdate();

    }

    public void flush(){
        em.flush(); //metodo que sincroniza o contexto de persistência da base de dados
    }
}
