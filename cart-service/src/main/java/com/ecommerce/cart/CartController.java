package com.ecommerce.cart;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    
    private final CartItemRepository cartItemRepository;

    public CartController(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable String userId) {
        return cartItemRepository.findByUserId(userId);
    }

    @PostMapping
    public CartItem addItemToCart(@RequestBody CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    @DeleteMapping("/{userId}")
    @Transactional
    public ResponseEntity<Void> clearCart(@PathVariable String userId) {
        cartItemRepository.deleteByUserId(userId);
        return ResponseEntity.ok().build();
    }
}
