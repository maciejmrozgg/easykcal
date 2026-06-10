import { forwardRef } from 'react';
import '../styles/ProductList.css';

const ProductList = forwardRef(({ products, visibleCount, onEdit, onDelete, user }, ref) => {
  return (
    <ol ref={ref} className="scrollable-list">
      {products.slice(0, visibleCount).map(p => (
        <li key={p.id}>
          <div className="li-content">

            <div className="product-details">
              <div className="product-info">
                {p.name} - <span className="kcal">{p.kcalPer100g} kcal</span>
              </div>

              <div className="product-macros">
                B: {p.proteinPer100g == null ? "-" : `${p.proteinPer100g}g`}{" "}
                T: {p.fatPer100g == null ? "-" : `${p.fatPer100g}g`}{" "}
                W: {p.carbsPer100g == null ? "-" : `${p.carbsPer100g}g`}
              </div>
            </div>

            {user && (
              <span>
                <button
                  className="editbtn"
                  onClick={() => onEdit(p)}
                >
                  ✏️ EDIT
                </button>

                <button
                  className="delbtn"
                  onClick={() => onDelete(p)}
                >
                  🗑️ DELETE
                </button>
              </span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
});

export default ProductList;