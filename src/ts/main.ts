import { initGallery } from "./gallery";
import { loadProducts } from "./productBlocks";
import { setActiveNav } from "./activeNav";
import { loginModal } from "./loginModal";
import {updateCartCounter, loadCartProducts} from "./cart"
import { contactForm } from "./contact";

document.addEventListener("DOMContentLoaded", () => {
    loginModal();
    updateCartCounter();
    const path = setActiveNav();
    if (path === "/") {
        loadProducts("#selected-products .product__block__grid", "selected products", 4);
        loadProducts("#new-products .product__block__grid", "new products arrival", 4);
        initGallery();
    }
    else if(path == "/cart"){
        loadCartProducts(".cart__items");
    }
    else if(path == "/contact"){
        contactForm();
    }
});
