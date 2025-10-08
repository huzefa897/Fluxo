package com.Inventory.Fluxo.controller;

import com.Inventory.Fluxo.models.products;
import com.Inventory.Fluxo.service.productsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")  // 👈 all routes now live under /api/**
public class productsController {

    @Autowired
    private productsService service;

    @GetMapping("/hello")
    public String greet() { return "Hello World"; }

    @GetMapping("/products")
    public List<products> getAllProducts() { return service.getAllProducts(); }

    @GetMapping("/products/{id}")
    public products getProductById(@PathVariable int id){ return service.getProductsById(id); }

    @PutMapping("/products/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable int id, @RequestBody products product){
        try{
            products updated = service.UpdateProduct(id, product);
            return updated != null
                    ? new ResponseEntity<>("Updated", HttpStatus.ACCEPTED)
                    : new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.I_AM_A_TEAPOT);
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id){
        var p = service.getProductsById(id);
        if (p != null) { service.deleteProduct(id); return new ResponseEntity<>("Deleted", HttpStatus.ACCEPTED); }
        return new ResponseEntity<>("Unable to delete check the values", HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/products/{id}/add/{quantity}")
    public ResponseEntity<?> add(@PathVariable int id, @PathVariable int quantity){
        if (service.getProductsById(id) != null && quantity >= 1) {
            service.addProductQuantity(id, quantity);
            return new ResponseEntity<>("Quantity has been Updated", HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<>("Addition Failed as the Prod doesn't exist", HttpStatus.BAD_GATEWAY);
    }

    @PutMapping("/products/{id}/remove/{quantity}")
    public ResponseEntity<?> remove(@PathVariable int id, @PathVariable int quantity){
        if (service.getProductsById(id) != null && quantity >= 1) {
            service.removeProductQuantity(id, quantity);
            return new ResponseEntity<>("Quantity has been Updated", HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<>("Addition Failed as the Prod doesn't exist", HttpStatus.BAD_GATEWAY);
    }

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestBody products product){
        try { return ResponseEntity.ok(service.addProduct(product)); }
        catch (Exception e) { return new ResponseEntity<>(e.getMessage(), HttpStatus.I_AM_A_TEAPOT); }
    }

    // SKU routes
    @GetMapping("/sku/{sku}")
    public products getProductBySku(@PathVariable String sku) { return service.getProductsBySku(sku); }

    @DeleteMapping("/sku/{sku}")
    public ResponseEntity<String> deleteProductSku(@PathVariable String sku){
        var p = service.getProductsBySku(sku);
        if (p != null) { service.deleteProduct(p.getId()); return new ResponseEntity<>("Deleted", HttpStatus.ACCEPTED); }
        return new ResponseEntity<>("Unable to delete check the values", HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/sku/{sku}/remove/{quantity}")
    public ResponseEntity<?> remove(@PathVariable String sku, @PathVariable int quantity){
        var p = service.getProductsBySku(sku);
        if (p != null && quantity >= 1) {
            service.removeProductQuantity(p.getId(), quantity);
            return new ResponseEntity<>("Quantity has been Updated", HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<>("Addition Failed as the Prod doesn't exist", HttpStatus.BAD_GATEWAY);
    }

    @PutMapping("/sku/{sku}/add/{quantity}")
    public ResponseEntity<?> add(@PathVariable String sku, @PathVariable int quantity){
        var p = service.getProductsBySku(sku);
        if (p != null && quantity >= 1) {
            service.addProductQuantity(p.getId(), quantity);
            return new ResponseEntity<>("Quantity has been Updated", HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<>("Addition Failed as the Prod doesn't exist", HttpStatus.BAD_GATEWAY);
    }

    @PutMapping("/sku/{sku}")
    public ResponseEntity<String> updateProduct(@PathVariable String sku, @RequestBody products product){
        try{
            var existing = getProductBySku(sku);
            var updated = service.UpdateProduct(existing.getId(), product);
            return updated != null
                    ? new ResponseEntity<>("Updated", HttpStatus.ACCEPTED)
                    : new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.I_AM_A_TEAPOT);
        }
    }
}
