import { loadProducts } from "./productBlocks";
import { LoadProductOptions } from "./types";

export default function initCatalog(): void {
    const containerSelector = ".catalog-products-items";

    const pageSize = 12;
    let currentPage = 1;
    let totalPages = 1;

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
            skip: (currentPage - 1) * pageSize,
            limit: pageSize,
            random: false,
            sizeFilter: sizeSelect?.value ?? "",
            colorFilter: colorSelect?.value ?? "",
            categoryFilter: categorySelect?.value ?? "",
            saleFilter: salesCheckbox?.checked ?? false,
            nameFilter: searchInput?.value.trim() ?? "",
            sortBy: sortingSelect?.value ?? "default",
            onTotal: handleTotalCount,
        } as LoadProductOptions;
    }

    function reload(): void {
        loadProducts(buildOptions());
    }

    reload();

    const resetAndReload = () => { currentPage = 1; reload(); };
    searchInput?.addEventListener("input", resetAndReload);
    sortingSelect?.addEventListener("change", resetAndReload);
    sizeSelect?.addEventListener("change", resetAndReload);
    colorSelect?.addEventListener("change", resetAndReload);
    categorySelect?.addEventListener("change", resetAndReload);
    salesCheckbox?.addEventListener("change", resetAndReload);

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
        currentPage = 1;
        reload();
    });

    const paginationContainer = document.getElementById("pagination-controls") as HTMLElement | null;
    const paginationSummary = document.getElementById("pagination-summary") as HTMLElement | null;

    function handleTotalCount(total: number) {
        totalPages = Math.max(1, Math.ceil(total / pageSize));

        if (currentPage > totalPages) {
            currentPage = totalPages;
            reload();
            return;
        }
        renderPagination();
        if (paginationSummary) {
            const start = Math.min((currentPage - 1) * pageSize + 1, total || 0);
            const end = Math.min(currentPage * pageSize, total);
            paginationSummary.textContent = `Showing ${start}-${end} Of ${total} Results`;
        }
    }

    function renderPagination() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = "";

        const prev = document.createElement('button');
        prev.className = 'pagination-prev bold-700';
        prev.textContent = '< BACK';
        prev.addEventListener('click', () => {
            if (currentPage <= 1) return;
            currentPage--;
            reload();
        });
        if (currentPage === 1) prev.style.display = 'none';
        paginationContainer.appendChild(prev);

        const pagesToShow = [] as number[];
        for (let p = 1; p <= totalPages; p++) pagesToShow.push(p);

        pagesToShow.forEach(p => {
            const btn = document.createElement('button');
            btn.className = 'pagination-page';
            if (p === currentPage) btn.classList.add('active');
            btn.textContent = String(p);
            btn.dataset.page = String(p);
            btn.addEventListener('click', () => {
                if (currentPage === p) return;
                currentPage = p;
                reload();
            });
            paginationContainer.appendChild(btn);
        });

        const next = document.createElement('button');
        next.className = 'pagination-next bold-700';
        next.textContent = 'NEXT >';
        next.addEventListener('click', () => {
            if (currentPage >= totalPages) return;
            currentPage++;
            reload();
        });
        if (currentPage >= totalPages) next.style.display = 'none';
        paginationContainer.appendChild(next);
    }
}
