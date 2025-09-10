exports.calculateCalories = (req, res) => {
  const { kcalPer100g, weight } = req.body;

  const kcalNum = parseFloat(kcalPer100g);
  const weightNum = parseFloat(weight);

 if (isNaN(kcalNum) || isNaN(weightNum) || kcalNum <= 0 || weightNum <= 0) {
  return res.status(400).json({ error: 'Nieprawidłowa wartość kalorii lub wagi' });
}

  const result = (kcalNum / 100) * weightNum;
  res.json({ result });
};

exports.calculateReverse = (req, res) => {
  const { calories, kcalPer100g } = req.body;

  const caloriesNum = parseFloat(calories);
  const kcalNum = parseFloat(kcalPer100g);

  if (isNaN(caloriesNum) || isNaN(kcalNum)|| kcalNum <= 0 || caloriesNum <= 0) {
    return res.status(400).json({ error: 'Nieprawidłowa wartość kalorii lub wagi' });
  }

  const weight = (caloriesNum * 100) / kcalNum;
  res.json({ weight });
};