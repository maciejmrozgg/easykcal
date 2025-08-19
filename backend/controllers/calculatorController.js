exports.calculateCalories = (req, res) => {
  const { kcalPer100g, weight } = req.body;

  if (!kcalPer100g || !weight) {
    return res.status(400).json({ error: 'Brakuje danych wejściowych' });
  }

  const result = (kcalPer100g / 100) * weight;
  res.json({ result });
};

exports.calculateReverse = (req, res) => {
  const { calories, kcalPer100g } = req.body;

  if (!calories || !kcalPer100g) {
    return res.status(400).json({ error: 'Brakuje danych wejściowych' });
  }

  const weight = (calories * 100) / kcalPer100g;
  res.json({ weight });
};