package com.java.client.feign;

import com.java.model.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "product-service", url = "${microservicio.url}")
public interface ProductFeignClient {

    @GetMapping("/api/productos")
    List<Product> getAllProducts();

    @GetMapping("/api/productos/{id}")
    Product getProductById(@PathVariable Integer id);

    @PostMapping("/api/productos")
    Product createProduct(@RequestBody Product product);

    @PutMapping("/api/productos/{id}")
    Product updateProductById(@PathVariable Integer id, @RequestBody Product product);

    @DeleteMapping("/api/productos/{id}")
    Product deleteProductById(@PathVariable Integer id);

    @GetMapping("/api/productos/minusStock")
    List<Product> findProductsByMinusStock();


}
