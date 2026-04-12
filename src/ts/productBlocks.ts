import { Product } from "./types";

export async function loadProducts(containerSelector: string, blockSelector: string, limit: number): Promise<void> {
  try {
    const response = await fetch("../assets/data.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const json = await response.json();
    const products: Product[] = json.data;
    const container = document.querySelector<HTMLDivElement>(containerSelector);

    if (!container) {
      console.error("Container not found");
      return;
    }

    const selectedProducts = products.filter(product =>
      product.blocks.some(
        block => block.toLowerCase() === blockSelector
      )
    ).slice(0, limit);

    selectedProducts.forEach(product => {
      container.insertAdjacentElement("beforeend", createProductCard(product));
    });

  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

function createProductCard(product: Product): HTMLElement {
  const card = document.createElement("div");
  card.className = "product__card";

  card.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}" />
    ${product.salesStatus ? `<span class="badge bold--700">SALE</span>` : ""}
    <h3 class="bold--700">${product.name}</h3>
    <p class="bold--700">$${product.price}</p>
    <button class="btn btn--primary">Add to Cart</button>
  `;

  return card;
}
