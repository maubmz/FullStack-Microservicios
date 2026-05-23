package com.java.controller;

import com.java.model.Product;
import com.java.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/allProducts")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Integer id) {
        return productService.getProductById(id);
    }

    @PostMapping("/create")
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    @PutMapping("/update/{id}")
    public Product updateProduct(@RequestBody Product product, @PathVariable Integer id) {
        return productService.updateProductById(product, id);
    }

    @DeleteMapping("/delete/{id}")
    public Product deleteProductById(@PathVariable Integer id) {
        return productService.deletePRoductById(id);
    }

    @GetMapping("/minusStock")
    List<Product> findProductsByMinusStock() {
        return productService.getProductsByMinusStock();
    }

}
