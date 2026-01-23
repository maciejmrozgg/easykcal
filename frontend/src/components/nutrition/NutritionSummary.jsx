import './styles/NutritionSummary.css';
import { motion, AnimatePresence } from "framer-motion";

export default function NutritionSummary({ selectedProducts, onRemove, onReset, undoItem, onUndo }) {
  const totalKcal = parseFloat(
    selectedProducts.reduce((sum, p) => sum + (p.result || 0), 0).toFixed(2)
  );

  return (
    <div className="nutrition-summary">
      <h2>Podsumowanie kalorii</h2>
      <div className="products-grid">
        <AnimatePresence mode='popLayout' initial={false}>
          {selectedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="product-card-wrapper"
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="product-card">
                <button
                  className="remove-btn"
                  onClick={() => onRemove(product.id)}
                  title="Usuń"
                >
                  ✕
                </button>
                <div className="product-name">{product.name}</div>
                <div className="product-kcal">
                  {product.weight} g – {product.result.toFixed(2)} kcal
                </div>
              </div>

              {index < selectedProducts.length - 1 && (
                <span className="plus">+</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {selectedProducts.length > 0 && (
          <motion.div
            className="product-card total"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="product-name">Razem</div>
            <div className="product-kcal">{totalKcal} kcal</div>
          </motion.div>
        )}
      </div>

      {selectedProducts.length > 0 && (
        <motion.button
          className="reset-btn"
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Wyczyść wszystko
        </motion.button>
      )}

      {undoItem?.product && (
        <motion.div
          className="undo-bar"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
        >
          Usunięto <strong>{undoItem.product.name}</strong>
          <button onClick={onUndo}>Cofnij</button>
        </motion.div>
      )}
    </div>
  );
}
