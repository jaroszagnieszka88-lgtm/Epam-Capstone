import { initGallery } from "./gallery";
import { loadProducts } from "./productBlocks";

initGallery();

document.addEventListener("DOMContentLoaded", () => {
    loadProducts("#selected-products .product__block__grid", "selected products", 4);
    loadProducts("#new-products .product__block__grid", "new products arrival", 4);
});

