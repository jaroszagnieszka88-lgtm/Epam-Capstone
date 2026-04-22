import { Cart, Product } from './types'

const CART_KEY = "cart";
const EMPTY_CART_TEXT = "Your cart is empty. Use the catalog to add new items.";

function getCart(): Cart {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
}

function saveCart(cart: Cart): void {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function updateCartCounter(): void {
    const counter = document.getElementById("cart-counter");

    if (!counter) return;

    const cart = getCart();
    const totalItems = Object.keys(cart).reduce((sum, key) => {
        return sum + cart[key];
    }, 0);

    if (totalItems > 0) {
        counter.textContent = String(totalItems);
        counter.removeAttribute("hidden");
    } else {
        counter.textContent = "";
        counter.setAttribute("hidden", "true");
    }
}

export function addToCart(productId: string, amount = 1): void {
    const cart = getCart();

    cart[productId] = (cart[productId] || 0) + amount;

    saveCart(cart);
    updateCartCounter();
}

export async function loadCartProducts(containerSelector: string): Promise<void> {
    try {
        const container = document.querySelector<HTMLDivElement>(containerSelector);
        const cart = getCart();
        if (Object.keys(cart).length == 0) {
            if (container)
                container.textContent = EMPTY_CART_TEXT;
            return;
        }
        const response = await fetch("../assets/data.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const json = await response.json();
        const products: Product[] = json.data;

        if (!container) {
            console.error("Container not found");
            return;
        }

        const selectedProducts = products.filter(product =>
            cart[product.id]
        );

        selectedProducts.forEach(product => {
            container.insertAdjacentElement("afterbegin", createProductRow(product, cart[product.id]));
        });
        updateCartSummary();
        attachCheckoutListener();
        attachClearListener();
        attachCartListeners(container);
    } catch (error) {
        console.error("Failed to load products:", error);
    }
}

function createProductRow(product: Product, quantity: number): HTMLElement {
    const row = document.createElement("div");
    row.className = "cart-row";
    row.dataset.productId = product.id;

    row.innerHTML = `
        <div class="cart-image">
            <img src="${product.imageUrl}" alt="product" />
        </div>
        <div class="cart-name bold-700">${product.name}</div>
        <div class="cart-price bold-700">$${product.price}</div>
        <div class="cart-quantity bold-700">
            <button class="qty-btn minus bold-700">-</button>
            <span class="cart_quantity bold-700">${quantity}</span>
            <button class="qty-btn plus bold-700">+</button>
        </div>
        <div class="cart-total bold-700">$${quantity * product.price}</div>
        <div class="cart-delete bold-700">🗑</div>
  `;

    return row;
}

function updateCartSummary(): void {
    const rows = document.querySelectorAll(".cart-row");

    const subtotalEl = document.getElementById("subtotal");
    const discountEl = document.getElementById("discount");
    const totalEl = document.getElementById("total");
    if(!discountEl || !subtotalEl || !totalEl)
        return;
    
    const discountRow = discountEl.parentElement as HTMLElement;

    const SHIPPING = 30;

    let subtotal = 0;

    rows.forEach((row) => {
        const totalEl = row.querySelector(".cart-total") as HTMLElement;
        const value = parseFloat(totalEl.textContent.replace("$", ""));
        subtotal += value;
    });

    let discount = 0;
    if (subtotal > 3000) {
        discount = subtotal * 0.1;
        discountRow.removeAttribute("hidden");
        discountEl.textContent = `$${discount.toFixed(2)}`;
    } else {
        discountRow.setAttribute("hidden", "true");
    }

    const total = subtotal - discount + SHIPPING;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function attachCartListeners(container: HTMLElement): void {
    container.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const cart = getCart();

        const row = target.closest(".cart-row") as HTMLElement | null;
        if (!row) return;

        const productId = row.dataset.productId as string;

        const deleteBtn = target.closest(".cart-delete");
        if (deleteBtn) {
            row.remove();
            delete cart[productId];
            saveCart(cart);
            updateCartCounter();
            updateCartSummary();
            return;
        }

        const qtySpan = row.querySelector(".cart_quantity") as HTMLElement;
        const priceEl = row.querySelector(".cart-price") as HTMLElement;
        const totalEl = row.querySelector(".cart-total") as HTMLElement;

        if (!qtySpan || !priceEl || !totalEl) return;

        let quantity = parseInt(qtySpan.textContent || "1", 10);

        if (target.closest(".plus")) {
            quantity += 1;
            cart[productId] = quantity;
        }

        if (target.closest(".minus")) {
            if (quantity === 1) return;
            quantity -= 1;
            cart[productId] = quantity;
        }

        const price = parseFloat(priceEl.textContent.replace("$", ""));
        qtySpan.textContent = String(quantity);
        totalEl.textContent = `$${quantity * price}`;
        saveCart(cart);
        updateCartCounter();
        updateCartSummary();
    });
}

function attachClearListener(): void{
    const btn = document.querySelector("#cart-clear");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const itemsContainer = document.getElementById("cart-items");
        if (itemsContainer) {
            itemsContainer.innerHTML = "";
            itemsContainer.textContent = EMPTY_CART_TEXT;

        }

        saveCart({});
        updateCartCounter();
        updateCartSummary();
    });
}

function attachCheckoutListener(): void {
    const btn = document.querySelector("#cart-checkout") as HTMLButtonElement | null;

    if (!btn) return;

    btn.addEventListener("click", () => {
        alert("Thank you for your purchase.");

        const itemsContainer = document.getElementById("cart-items");
        if (itemsContainer) {
            itemsContainer.innerHTML = "";
            itemsContainer.textContent = EMPTY_CART_TEXT;
        }

        saveCart({});
        updateCartCounter();
        updateCartSummary();
    });
}
