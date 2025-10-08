package com.Inventory.Fluxo.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="products")
public class products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "sku", unique = true, nullable = false)
    private String sku;
    private String name;
    private String description;
    private String brand; //table
    private String category; //table
    private int quantity;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date expiryDate; //table
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date lastAddDate; //table
}

// OCR Reading Image Processing for BarCode


