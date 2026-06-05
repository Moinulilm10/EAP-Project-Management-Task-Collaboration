"use client";

interface Props {
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ total, page, limit, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const makeRange = () => {
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = makeRange();

  return (
    <nav
      className="flex items-center justify-center gap-3"
      aria-label="Pagination"
    >
      <button
        aria-label="Previous page"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`p-2 rounded-xl border cursor-pointer ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-surface-container-high"}`}
      >
        ‹
      </button>

      <div className="hidden sm:flex items-center gap-2">
        {pages[0] > 1 && (
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 rounded-xl border hover:bg-surface-container-high"
          >
            1
          </button>
        )}

        {pages[0] > 2 && <span className="px-2">…</span>}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`px-3 py-1 rounded-xl border ${p === page ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-container-high"}`}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages - 1 && (
          <span className="px-2">…</span>
        )}

        {pages[pages.length - 1] < totalPages && (
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded-xl border hover:bg-surface-container-high"
          >
            {totalPages}
          </button>
        )}
      </div>

      <button
        aria-label="Next page"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={`p-2 rounded-xl border cursor-pointer ${page === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-surface-container-high"}`}
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;
