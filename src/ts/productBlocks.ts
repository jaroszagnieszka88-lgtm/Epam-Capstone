import { LoadProductOptions, Product } from "./types";
import { addToCart } from "./cart"

export async function loadProducts(options: LoadProductOptions): Promise<void> {
  try {
    const response = await fetch("../assets/data.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const json = await response.json();
    const products: Product[] = json.data;
    const opts: LoadProductOptions = {
      containerSelector: options.containerSelector,
      blockSelector: (options.blockSelector ?? "").toLowerCase(),
      skip: options.skip ?? 0,
      limit: options.limit ?? products.length,
      random: options.random ?? false,
      sizeFilter: options.sizeFilter ?? "",
      colorFilter: (options.colorFilter ?? "").toLowerCase(),
      categoryFilter: (options.categoryFilter ?? "").toLowerCase(),
      saleFilter: options.saleFilter ?? false,
      nameFilter: options.nameFilter ?? "",
      sortBy: options.sortBy ?? 'default',
      onTotal: options.onTotal,
    } as LoadProductOptions;

    const container = document.querySelector<HTMLDivElement>(opts.containerSelector);

    if (!container) {
      console.error("Container not found");
      return;
    }

    const filteredProducts = getFilteredProducts(products, opts);

    try {
      opts.onTotal?.(filteredProducts.length);
    } catch (e) {
      console.log(e);
    }

    const sortBy = opts.sortBy ?? 'default';
    if (sortBy && sortBy !== 'default' && !opts.random) {
      if (sortBy === 'priceA') {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'priceD') {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'popularity') {
        filteredProducts.sort((a, b) => b.popularity - a.popularity);
      }
    }

    if (opts.random) {
      for (let i = filteredProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredProducts[i], filteredProducts[j]] = [filteredProducts[j], filteredProducts[i]];
      }
    }

    const selectedProducts = filteredProducts.slice(opts.skip, opts.skip + opts.limit);
    container.innerHTML = "";
    selectedProducts.forEach(product => {
      container.insertAdjacentElement("beforeend", createProductCard(product, opts.blockSelector));
    });
    attachCardListeners(container);
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

function getFilteredProducts(products: Product[], o: LoadProductOptions) {
  const sizeFilter = (o.sizeFilter || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  return products.filter(product => {
    const blockMatch = o.blockSelector === "" || product.blocks.some(block => block.toLowerCase() === o.blockSelector);
    const categoryMatch = o.categoryFilter === "" || product.category.toLowerCase() === o.categoryFilter;
    const colorMatch = o.colorFilter === "" || product.color.toLowerCase() === o.colorFilter;
    const nameMatch = o.nameFilter === "" || product.name.toLowerCase().includes(o.nameFilter.toLowerCase());
    const saleMatch = !o.saleFilter || product.salesStatus;

    let sizeMatch = true;
    if (o.sizeFilter && sizeFilter.length) {
      const productSizes = (product.size || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      sizeMatch = sizeFilter.some(sf => productSizes.indexOf(sf) !== -1);
    }

    return blockMatch && categoryMatch && colorMatch && sizeMatch && nameMatch && saleMatch;
  });
}

function createProductCard(product: Product, blockSelector: string): HTMLElement {
  const redirect = blockSelector == "new products arrival";
  const buttonText = redirect ? "View Product" : "Add to Cart";
  const button = redirect ? `<a href="/product?id=${product.id}" class="btn btn-primary width-full">${buttonText}</a>`
    : `<button class="btn btn-primary ts-btn-buy" data-product-id="${product.id}">${buttonText}</button>`;
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <a href="/product?id=${product.id}">
      <img src="${product.imageUrl}" alt="${product.name}" />
      ${product.salesStatus ? `<span class="badge bold-700">SALE</span>` : ""}
      <h3 class="bold-700">${product.name}</h3>
    </a>
    <div class="product-card-bottom">
      <p class="bold-700">$${product.price}</p>
      ${button}
    </div>
  `;

  return card;
}

function attachCardListeners(container: HTMLElement): void {
  container.removeEventListener("click", handleCardClick);
  container.addEventListener("click", handleCardClick);
}

function handleCardClick(event: Event): void {
  const target = event.target as HTMLElement;

  const buyButton = target.closest(".ts-btn-buy");
  if (!buyButton || !(buyButton instanceof HTMLElement)) return;

  const productId = buyButton.dataset.productId;
  if (!productId) return;

  addToCart(productId, 1);
}
