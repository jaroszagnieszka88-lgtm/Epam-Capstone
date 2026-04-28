import { addToCart as cartAddToCart } from './cart';
import { Product } from './types';

let quantity : number;

export function initProductPreview(): void {
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get('id');

	const container = document.querySelector<HTMLElement>(".product-preview-small");
	const mainImg = document.querySelector<HTMLImageElement>("#product-main");

	if (!container || !mainImg || !id) return;

	const smallImages = container.querySelectorAll<HTMLImageElement>("img");
	if (!smallImages) return;
	smallImages[0].src = mainImg.src = `/images/${id}.png`;

	container.addEventListener("click", (event) => {
		const target = event.target as HTMLImageElement;
		if (!target) return;
		mainImg.src = target.src;
	});
}

export function initProductTabs(): void {
	const tabsSections = Array.from(document.querySelectorAll<HTMLElement>('.tabs'));
	if (!tabsSections.length) return;

	tabsSections.forEach((tabs) => {
		const headers = Array.from(tabs.querySelectorAll<HTMLElement>('.tabs-headers-item'));
		const items = Array.from(tabs.querySelectorAll<HTMLElement>('.tabs-items > div'));

		if (!headers.length || !items.length) return;

		let activeIndex = headers.findIndex(h => h.querySelector('h2')?.classList.contains('item-active'));
		if (activeIndex === -1) activeIndex = 0;

		headers.forEach((h, i) => {
			const h2 = h.querySelector('h2');
			if (!h2) return;
			if (i === activeIndex) h2.classList.add('item-active');
			else h2.classList.remove('item-active');
		});

		items.forEach((it, i) => {
			if (i === activeIndex) it.removeAttribute('hidden');
			else it.setAttribute('hidden', 'true');
		});

		headers.forEach((h, idx) => {
			initTabHeader(h, headers, idx, items);
		});

		const reviewForm = document.getElementById("reviewForm") as HTMLFormElement;
		if (reviewForm) {
			reviewForm.addEventListener("submit", e => {
				e.preventDefault();
				if (reviewForm.checkValidity())
					alert("valid");
				else
					alert("form not valid");
			});
		}
	});
}

function initTabHeader(h: HTMLElement, headers: HTMLElement[], idx: number, items: HTMLElement[]) {
	h.addEventListener('click', () => {
		headers.forEach(hh => hh.querySelector('h2')?.classList.remove('item-active'));
		h.querySelector('h2')?.classList.add('item-active');

		items.forEach((it, i) => {
			if (i === idx) it.removeAttribute('hidden');
			else it.setAttribute('hidden', 'true');
		});
	});
}

export async function initProductForm(): Promise<void> {
	const minusBtn = document.getElementById('quantity-minus') as HTMLButtonElement | null;
	const plusBtn = document.getElementById('quantity-plus') as HTMLButtonElement | null;
	const qtySpan = document.getElementById('product-quantity');
	const addBtn = document.getElementById('add-to-cart') as HTMLButtonElement | null;
	const sizeSelect = document.getElementById('size-select') as HTMLSelectElement | null;
	const colorSelect = document.getElementById('color-select') as HTMLSelectElement | null;
	const categorySelect = document.getElementById('category-select') as HTMLSelectElement | null;
	const nameEl = document.getElementById('product-name') as HTMLSelectElement | null;
	const priceEl = document.getElementById('product-price') as HTMLSelectElement | null;
	const ratingEl = document.getElementById('product-rating-stars') as HTMLSelectElement | null;

	if (!qtySpan || !(qtySpan instanceof HTMLElement) || !addBtn) return;

	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get('id');

	try {
		const response = await fetch('../assets/data.json');
		if (!response.ok) throw new Error(`HTTP error ${response.status}`);
		const json = await response.json();
		const products = Array.isArray(json.data) ? json.data : [];
		const product = id ? products.find((p: Product) => p.id === id) as Product : null;

		if (!product) return;
		const categories = product.category.split(",");
		const allSizes = product.size.split(",");
		const allColors = product.color.split(",");

		if (nameEl) {
			nameEl.textContent = product.name;
		}
		if (ratingEl) {
			const goldenStars = "★".repeat(Math.round(product.rating));
			const normalStars = "★".repeat(5 - goldenStars.length);
			ratingEl.innerHTML = `<span class="golden">${goldenStars}</span>${normalStars}`;
		}
		if (priceEl) {
			priceEl.textContent = `$${product.price}`;
		}
		initSelect(categorySelect, categories, sizeSelect, product, allSizes, colorSelect, allColors);
	} catch (err) {
		console.error('Failed to load product options:', err);
	}

	quantity = parseInt(qtySpan.textContent ?? '1', 10);
	if (isNaN(quantity) || quantity < 1) {
		quantity = 1;
		qtySpan.textContent = '1';
	}

	initPlusMinusBtn(minusBtn, qtySpan, plusBtn);

	initAddBtn(addBtn, id, sizeSelect, colorSelect, categorySelect, qtySpan);
}

function initSelect(categorySelect: HTMLSelectElement | null,
	categories: string[],
	sizeSelect: HTMLSelectElement | null,
	product: Product,
	allSizes: string[],
	colorSelect: HTMLSelectElement | null,
	allColors: string[]) {
	if (categorySelect) {
		setPlaceholder(categorySelect, 'Choose category');
		categories.forEach(c => addOption(c, categorySelect));
	}

	if (sizeSelect) {
		setPlaceholder(sizeSelect, 'Choose size');
		const productSizes: string[] = product?.size?.toString()
			.split(',')
			.map((s: string) => s.trim())
			.filter(Boolean) ?? [];
		const sizesToUse = productSizes.length ? productSizes : allSizes;
		sizesToUse.forEach(s => addOption(s, sizeSelect));
	}

	if (colorSelect) {
		setPlaceholder(colorSelect, 'Choose color');
		const productColors: string[] = product?.color?.toString()
			.split(',')
			.map((s: string) => s.trim())
			.filter(Boolean) ?? [];
		const colorsToUse = productColors.length ? productColors : allColors;
		colorsToUse.forEach(c => addOption(c, colorSelect));
	}
}

function initAddBtn(addBtn: HTMLButtonElement, id: string | null, sizeSelect: HTMLSelectElement | null, colorSelect: HTMLSelectElement | null, categorySelect: HTMLSelectElement | null, qtySpan: HTMLElement) {
	addBtn.addEventListener('click', () => {
		if (!id || !sizeSelect || !colorSelect || !categorySelect
			|| !sizeSelect.value || !colorSelect.value || !categorySelect.value) {
			return;
		}

		cartAddToCart(id, quantity);

		sizeSelect.selectedIndex = 0;
		colorSelect.selectedIndex = 0;
		categorySelect.selectedIndex = 0;

		quantity = 1;
		qtySpan.textContent = '1';
	});
}

function initPlusMinusBtn(minusBtn: HTMLButtonElement | null, qtySpan: HTMLElement, plusBtn: HTMLButtonElement | null) {
	minusBtn?.addEventListener('click', () => {
		if (quantity <= 1) return;
		quantity -= 1;
		qtySpan.textContent = String(quantity);
	});

	plusBtn?.addEventListener('click', () => {
		quantity += 1;
		qtySpan.textContent = String(quantity);
	});
}

function addOption(c: string, container: HTMLSelectElement) {
	const o = document.createElement('option');
	o.value = c;
	o.textContent = c;
	container.appendChild(o);
}

function setPlaceholder(sel: HTMLSelectElement, text: string) {
	sel.innerHTML = '';
	const ph = document.createElement('option');
	ph.value = '';
	ph.disabled = true;
	ph.selected = true;
	ph.textContent = text;
	sel.appendChild(ph);
}

export function initFakePlaceholders(): void {
	const containers = Array.from(document.querySelectorAll<HTMLElement>('.fake-placeholder'));
	if (!containers.length) return;

	containers.forEach(container => {
		const field = container.querySelector('input:not([type="checkbox"]), textarea, select');
		if (!field || !(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return;

		const update = () => {
			const val = field.value;

			if (val.trim() === '') {
				container.classList.remove('has-value');
			} else {
				container.classList.add('has-value');
			}
		};

		update();
		field.addEventListener('input', update);
		field.addEventListener('change', update);
	});
}

