package aor.paj.dao;

import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;

import java.io.Serializable;

@TransactionAttribute(TransactionAttributeType.REQUIRED)
public abstract class AbstratDao <T extends Serializable> implements Serializable {



}
