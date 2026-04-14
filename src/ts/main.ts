import { initGallery } from "./gallery";
import { loadProducts } from "./productBlocks";
import { setActiveNav } from "./activeNav";
document.addEventListener("DOMContentLoaded", () => {
    const path = setActiveNav();
    if (path === "/") {
        loadProducts("#selected-products .product__block__grid", "selected products", 4);
        loadProducts("#new-products .product__block__grid", "new products arrival", 4);
        initGallery();
    }
});
