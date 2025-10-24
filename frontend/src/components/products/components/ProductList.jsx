import { forwardRef } from 'react';
import '../styles/ProductList.css';

const ProductList = forwardRef(({ products, visibleCount, onEdit, onDelete }, ref) => {
  return (
    <ol ref={ref} className="scrollable-list">
      {products.slice(0, visibleCount).map(p => (
        <li key={p.id}>
          <div className="li-content">
            <span>{p.name} - {p.kcalPer100g} kcal</span>
            <span>
              <button className='editbtn' onClick={() => onEdit(p)}>✏️ EDIT</button>
              <button className='delbtn' onClick={() => onDelete(p.id)}>🗑️ DELETE</button>
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
});

export default ProductList;