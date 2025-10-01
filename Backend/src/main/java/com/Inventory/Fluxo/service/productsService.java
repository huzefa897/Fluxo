package com.Inventory.Fluxo.service;

import com.Inventory.Fluxo.models.products;
import com.Inventory.Fluxo.repo.IProductsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class productsService {

    @Autowired
    private IProductsRepo repo;


    public List<products> getAllProducts(){
        return repo.findAll();

    }

    public products getProductsById(int id) {
      return repo.findById(id).get();
    }

    public products addProduct(products product) {
       return repo.save(product);
    }

    public products UpdateProduct(int id,products product) {
        products newProduct= repo.findById(id).get();
        return repo.save(product);

    }
    public products getProductsBySku(String sku) {
        return repo.findBysku(sku)
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
    }
    public void deleteProduct(int id) {
        repo.deleteById(id);
    }
      public void addProductQuantity(int id, int quantity){
        products newProd = getProductsById(id);
        newProd.setQuantity(newProd.getQuantity()+quantity);
        repo.save(newProd);
      }

    public void removeProductQuantity(int id, int quantity) {
        products newProd = getProductsById(id);
        try {if(newProd.getQuantity()>= quantity)
        newProd.setQuantity(newProd.getQuantity()-quantity); repo.save(newProd);} catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
