import { initGallery } from "./gallery";
import { loadProducts } from "./productBlocks";

initGallery();

document.addEventListener("DOMContentLoaded", () => loadProducts(".selected .selected__grid", "selected products", 4));

