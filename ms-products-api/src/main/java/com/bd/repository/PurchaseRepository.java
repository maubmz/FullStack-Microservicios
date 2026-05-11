package com.bd.repository;

import com.bd.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

    @Query("SELECT DISTINCT p FROM Purchase p JOIN FETCH p.products JOIN FETCH p.client")
    List<Purchase> findAllPurchases();

    @Query("SELECT p FROM Purchase p JOIN FETCH p.products JOIN FETCH p.client WHERE p.id = :id")
    Optional<Purchase> findByIdPurchase(@Param("id") Integer id);

    @Transactional
    Purchase save(Purchase purchase);

    void deleteById(Integer id);
}
