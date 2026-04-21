import { initGallery } from "./gallery";
import { loadProducts } from "./productBlocks";
import { setActiveNav } from "./activeNav";
import { loginModal } from "./loginModal";
import {updateCartCounter, loadCartProducts} from "./cart"
import { contactForm } from "./contact";
import { initProductPreview, initProductTabs, initProductForm, initFakePlaceholders } from "./product";
import initCatalog from "./catalog";
import { LoadProductOptions } from "./types";

document.addEventListener("DOMContentLoaded", () => {
    loginModal();
    updateCartCounter();
    const path = setActiveNav();
    if (path === "/") {
        loadProducts(
            {containerSelector: "#selected-products .product__block__grid", blockSelector: "selected products", limit: 4} as LoadProductOptions
        );
        loadProducts(
            {containerSelector:"#new-products .product__block__grid", blockSelector: "new products arrival", limit:4} as LoadProductOptions
        );
        initGallery();
    }
    else if(path === "/cart"){
        loadCartProducts(".cart__items");
    }
    else if(path === "/contact"){
        contactForm();
    }
    else if(path === "/catalog"){
        initCatalog();
    }
    else if(path === "/product")
    {
        loadProducts(
            {containerSelector: "#also-like-products .product__block__grid", blockSelector: "", limit: 4, random: true} as LoadProductOptions
        );
        initProductPreview();
        initProductTabs();
        initProductForm();
        initFakePlaceholders();

    }
});
