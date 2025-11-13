import React from 'react';

type Filters = { name: string; category: string; minPrice: string; maxPrice: string };

export default function SearchBar({
  filters,
  setFilters,
  onSearch,
  onReset
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onSearch: () => void;
  onReset: () => void;
}) {
  return (
    <div className="card">
      <h2 style={{ margin: 0 }}>Find Your Favourite Mithai</h2>
      <p className="kicker">Search by name, category, or price range (₹).</p>
      <div className="controls">
        <input placeholder="Name (e.g., Gulab)" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Category (e.g., Bengali, Mithai)" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
        <input placeholder="Min Price (₹)" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        <input placeholder="Max Price (₹)" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
        <button className="primary" onClick={onSearch}>Apply Filters</button>
        <button className="ghost" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}