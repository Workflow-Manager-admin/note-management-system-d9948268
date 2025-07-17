import React from "react";

// PUBLIC_INTERFACE
export default function Sidebar({ categories, selected, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="category-list">
        <div className="sidebar-title">Categories</div>
        <div
          className={`category${selected === "all" ? " selected" : ""}`}
          onClick={() => onSelect("all")}
        >
          All
        </div>
        {categories.map((cat) => (
          <div
            className={`category${selected === cat ? " selected" : ""}`}
            key={cat}
            onClick={() => onSelect(cat)}
          >
            {cat}
          </div>
        ))}
      </div>
    </aside>
  );
}
