import { LoadProductOptions, Product } from "./types";
import {addToCart} from "./cart"

export async function loadProducts(options: LoadProductOptions): Promise<void> {
  try {
    const response = await fetch("../assets/data.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const json = await response.json();
    const products: Product[] = json.data;
    const container = document.querySelector<HTMLDivElement>(options.containerSelector);

    if (!container) {
      console.error("Container not found");
      return;
    }

    const filteredProducts = products.filter(product =>
      options.blockSelector === ""
      || product.blocks.some(
          block => block.toLowerCase() === options.blockSelector
        )
    );

    if (options.random) {
      for (let i = filteredProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredProducts[i], filteredProducts[j]] = [filteredProducts[j], filteredProducts[i]];
      }
    }

    const selectedProducts = filteredProducts.slice(options.skip, options.limit);
    container.innerHTML="";
    selectedProducts.forEach(product => {
      container.insertAdjacentElement("beforeend", createProductCard(product, options.blockSelector));
    });
    attachCardListeners(container);
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

function createProductCard(product: Product, blockSelector: string): HTMLElement {
  const redirect = blockSelector == "new products arrival";
  const buttonText = redirect ? "View Product" : "Add to Cart";
  const button = redirect ? `<a href="/product?id=${product.id}" class="btn btn--primary width--full">${buttonText}</a>` 
    : `<button class="btn btn--primary ts__btn--buy" data-product-id="${product.id}">${buttonText}</button>`;
  const card = document.createElement("div");
  card.className = "product__card";

  card.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}" />
    ${product.salesStatus ? `<span class="badge bold--700">SALE</span>` : ""}
    <h3 class="bold--700">${product.name}</h3>
    <div class="product__card__bottom">
      <p class="bold--700">$${product.price}</p>
      ${button}
    </div>
  `;

  return card;
}

function attachCardListeners(container: HTMLElement): void {
  container.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    const buyButton = target.closest(".ts__btn--buy") as HTMLElement | null;
    if (!buyButton) return;

    const productId = buyButton.dataset.productId;
    if (!productId) return;

    addToCart(productId, 1);
  });
}
