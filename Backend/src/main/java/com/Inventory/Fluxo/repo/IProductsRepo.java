package com.Inventory.Fluxo.repo;

import com.Inventory.Fluxo.models.products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IProductsRepo extends JpaRepository<products, Integer> {
    Optional<products> findBySKU(String SKU);


}
