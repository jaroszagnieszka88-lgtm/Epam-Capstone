import { loadProducts } from "./productBlocks";
import { LoadProductOptions } from "./types";

export default function initCatalog(): void {
    const containerSelector = ".catalog__products__items";

    const searchInput = document.getElementById("search") as HTMLInputElement | null;
    const sortingSelect = document.getElementById("sorting") as HTMLSelectElement | null;
    const sizeSelect = document.getElementById("size-select") as HTMLSelectElement | null;
    const colorSelect = document.getElementById("color-select") as HTMLSelectElement | null;
    const categorySelect = document.getElementById("category-select") as HTMLSelectElement | null;
    const salesCheckbox = document.getElementById("sales-checkbox") as HTMLInputElement | null;
    const filterToggle = document.getElementById("filter") as HTMLElement | null;
    const filterDetails = document.getElementById("filter-details") as HTMLElement | null;
    const filterHide = document.getElementById("filter-hide") as HTMLElement | null;
    const filterClear = document.getElementById("filter-clear") as HTMLElement | null;

    function buildOptions(): LoadProductOptions {
        return {
            containerSelector,
            blockSelector: "",
            skip: 0,
            limit: 9999,
            random: false,
            sizeFilter: sizeSelect?.value ?? "",
            colorFilter: colorSelect?.value ?? "",
            categoryFilter: categorySelect?.value ?? "",
            saleFilter: salesCheckbox?.checked ?? false,
            nameFilter: searchInput?.value.trim() ?? "",
            sortBy: sortingSelect?.value ?? "default",
        } as LoadProductOptions;
    }

    function reload(): void {
        loadProducts(buildOptions());
    }

    reload();

    searchInput?.addEventListener("keyup", () => reload());
    sortingSelect?.addEventListener("change", () => reload());
    sizeSelect?.addEventListener("change", () => reload());
    colorSelect?.addEventListener("change", () => reload());
    categorySelect?.addEventListener("change", () => reload());
    salesCheckbox?.addEventListener("change", () => reload());

    filterToggle?.addEventListener("click", () => {
        if (!filterDetails) return;
        if (filterDetails.hasAttribute("hidden")) filterDetails.removeAttribute("hidden");
        else filterDetails.setAttribute("hidden", "true");
    });
    filterHide?.addEventListener("click", () => filterDetails?.setAttribute("hidden", "true"));

    filterClear?.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (sortingSelect) sortingSelect.selectedIndex = 0;
        if (sizeSelect) sizeSelect.selectedIndex = 0;
        if (colorSelect) colorSelect.selectedIndex = 0;
        if (categorySelect) categorySelect.selectedIndex = 0;
        if (salesCheckbox) salesCheckbox.checked = false;
        reload();
    });
}
