import { useToast } from '../ui/toast/hooks/useToast';
import './styles/NutritionSummary.css';
import { motion, AnimatePresence } from "framer-motion";

export default function NutritionSummary({ selectedProducts, onRemove, onReset, undoItem, onUndo }) {
  const { showToast } = useToast();

  const totalKcal = parseFloat(
    selectedProducts.reduce((sum, p) => sum + (p.result || 0), 0).toFixed(2)
  );

  const totalWeight = parseFloat(
    selectedProducts.reduce((sum, p) => sum + (p.weight || 0), 0).toFixed(2)
  );

  const totalProtein = parseFloat(
    selectedProducts.reduce((sum, p) => sum + (p.protein || 0), 0).toFixed(1)
  );

  const totalFat = parseFloat(
    selectedProducts.reduce((sum, p) => sum + (p.fat || 0), 0).toFixed(1)
  );

  const totalCarbs = parseFloat(
    selectedProducts.reduce((sum, p) => sum + (p.carbs || 0), 0).toFixed(1)
  );

  return (
    <div className="nutrition-summary">
      <h2>Podsumowanie kalorii</h2>
      <div className="products-grid">
        <AnimatePresence mode='popLayout' initial={false}>
          {selectedProducts.map((product, index) => (
            <motion.div
              key={product.id ?? `${product.name}-${index}`}
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
                <div className="product-details">
                  {product.weight}g • {product.result.toFixed(2)} kcal

                  {product.hasMacros && (
                    <>
                      <div className="product-macros">
                        🥩 {product.protein.toFixed(1)}g
                      </div>

                      <div className="product-macros">
                        🧈 {product.fat.toFixed(1)}g
                      </div>

                      <div className="product-macros">
                        🍚 {product.carbs.toFixed(1)}g
                      </div>
                    </>
                  )}
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
            <div className="product-details">
              {totalWeight}g • {totalKcal} kcal
            </div>
            {selectedProducts.some(p => p.hasMacros) && (
              <>
                <div className="product-macros">
                  🥩 {totalProtein}g
                </div>

                <div className="product-macros">
                  🧈 {totalFat}g
                </div>

                <div className="product-macros">
                  🍚 {totalCarbs}g
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>

      {selectedProducts.length > 0 && (
        <motion.button
          className="reset-btn"
          onClick={() => {
            onReset();
            showToast('Wyczyszczono podsumowanie kalorii', 'info');
          }}
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
