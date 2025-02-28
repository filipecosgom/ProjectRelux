package aor.paj.bean;

import aor.paj.dao.ProductDao;
import jakarta.inject.Inject;

import java.io.Serializable;
import java.util.logging.LogManager;
import java.util.logging.Logger;

public class CategoryBean implements Serializable {

//private static final Logger logger= LogManager.getLogger(CategoryBean.class);
CategoryBean categoryBean;
ProductDao productDao;

@Inject
    public CategoryBean(final CategoryBean categoryBean, final ProductDao productDao) {

    this.categoryBean=categoryBean;
    this.productDao=productDao;
}
public CategoryBean (){}
}
