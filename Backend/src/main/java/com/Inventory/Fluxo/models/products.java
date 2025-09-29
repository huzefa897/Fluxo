package com.Inventory.Fluxo.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(unique = true, nullable = false)
    private String SKU;
    private String name;
    private String description;
    private String brand;
    private String Category;
    private int quantity;
    private Date expiryDate;
    private Date lastAddDate;
}
