package com.Inventory.Fluxo.controller;

import com.Inventory.Fluxo.models.products;
import com.Inventory.Fluxo.repo.IProductsRepo;
import com.Inventory.Fluxo.service.productsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@RequestMapping("/")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class productsController {
    @Autowired
    private productsService service;
    private IProductsRepo repo;

    @RequestMapping("/")
    public String Greet() {
        return "Hello World";

    }

    @GetMapping("/products")
    public List<products> getAllProducts() {
        return service.getAllProducts();
    }

    //ID
    @GetMapping("/products/{id}")
        public products getProductById(@PathVariable int id){
            return service.getProductsById(id);

    }
//Updating a product by id
    @PutMapping("/products/{id}")
    public ResponseEntity<String> UpdateProduct(@PathVariable int id,@RequestBody products product){
        try{
            products newProduct = service.UpdateProduct(id,product);
            if(newProduct != null){return new ResponseEntity<>("Updated",HttpStatus.ACCEPTED);}
            else {return new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);}

        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.I_AM_A_TEAPOT);
        }
    }
    //delete a product using id
    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id){
        products newProd =service.getProductsById(id);
        if(newProd!=null){ service.deleteProduct(id);return new ResponseEntity<>("Deleted",HttpStatus.ACCEPTED);}
        else{
            return new ResponseEntity<>("Unable to delete check the values", HttpStatus.BAD_REQUEST);
        }
    }
    //add quantity
    @PutMapping("products/{id}/add/{quantity}")
    public ResponseEntity<?> add(@PathVariable int id,@PathVariable int quantity){
        if(service.getProductsById(id)!=null && quantity >= 1){
            service.addProductQuantity(id,quantity);
            return new ResponseEntity<>("Quantity has been Updated", HttpStatus.ACCEPTED);}
        else{return new ResponseEntity<>("Addition Failed as the Prod doesn't exist", HttpStatus.BAD_GATEWAY);}
    }
    //remove quantity
    @PutMapping("products/{id}/remove/{quantity}")
    public ResponseEntity<?> remove(@PathVariable int id,@PathVariable int quantity){
        if(service.getProductsById(id)!=null && quantity >= 1){
            service.removeProductQuantity(id,quantity);
            return new ResponseEntity<>("Quantity has been Updated", HttpStatus.ACCEPTED);}
        else{return new ResponseEntity<>("Addition Failed as the Prod doesn't exist", HttpStatus.BAD_GATEWAY);}
    }
//Create a product
    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestBody products product){
        try{
        return ResponseEntity.ok(service.addProduct(product));
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.I_AM_A_TEAPOT);
        }
    }

    //Sku
    @GetMapping("/sku/{sku}")
    public products getProductBySku(@PathVariable String sku) {
        return service.getProductsBySku(sku);
    }
    //deleting a product with sku
    @DeleteMapping("delete/sku/{sku}")
    public ResponseEntity<String> deleteProductSku(@PathVariable String sku){
        products newProd =service.getProductsBySku(sku);
        if(newProd!=null){ service.deleteProduct(newProd.getId());return new ResponseEntity<>("Deleted",HttpStatus.ACCEPTED);}
        else{
            return new ResponseEntity<>("Unable to delete check the values", HttpStatus.BAD_REQUEST);
        }
    }
    //remove quantity
    @PutMapping("sku/{sku}/remove/{quantity}")
    public ResponseEntity<?> remove(@PathVariable String sku,@PathVariable int quantity){
        products prod = service.getProductsBySku(sku);
        if(prod!=null && quantity >= 1){
            service.removeProductQuantity(prod.getId(),quantity);
            return new ResponseEntity<>("Quantity has been Updated", HttpStatus.ACCEPTED);}
        else{return new ResponseEntity<>("Addition Failed as the Prod doesn't exist", HttpStatus.BAD_GATEWAY);}
    }
    //add quantity
    @PutMapping("sku/{sku}/add/{quantity}")
    public ResponseEntity<?> add(@PathVariable String sku,@PathVariable int quantity){
        products prod = service.getProductsBySku(sku);
        if(prod!=null && quantity >= 1){
            service.addProductQuantity(prod.getId(),quantity);
            return new ResponseEntity<>("Quantity has been Updated", HttpStatus.ACCEPTED);}
        else{return new ResponseEntity<>("Addition Failed as the Prod doesn't exist", HttpStatus.BAD_GATEWAY);}
    }
    @PutMapping("update/sku/{sku}")
    public ResponseEntity<String> UpdateProduct(@PathVariable String sku,@RequestBody products product){
        try{
            products newProduct = service.UpdateProduct(getProductBySku(sku).getId(),product);
            if(newProduct != null){return new ResponseEntity<>("Updated",HttpStatus.ACCEPTED);}
            else {return new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);}

        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.I_AM_A_TEAPOT);
        }
    }





}


