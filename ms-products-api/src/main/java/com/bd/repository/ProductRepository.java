package com.bd.repository;

import com.bd.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findAll();

    Optional<Product> findById(Integer id);

    Product save(Product product);

    void deleteById(Integer id);

    List<Product> findTop10ByOrderByStockAsc();

    // solucion con @Query para listar productos con menos stock
    /*
    @Query("SELECT p FROM Product p ORDER BY p.stock ASC")
    List<Product> productsWithMinusStock(Pageable pageable);
    */

    /*
    // Forma de llamar un metodo por medio de query
    @Modifying
    @Transactional
    @Query("DELETE FROM Product p WHERE p.id = :id")
    void deleteProductById(@Param("id") Integer id);
    */

}
