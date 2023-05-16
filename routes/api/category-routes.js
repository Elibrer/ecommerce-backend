const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
  const categoryData = await Category.findAll({
      include: [{ model: Product }],
  })
  res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoryById = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    })
    res.status(200).json(categoryById)
  } catch (err) {
      res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
      const categoryData =  await Category.create({
      })
      res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id);
    categoryData.set(req.body);
    await categoryData.save();
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
  })
  if (!categoryData) {
    res.status(404).json({ message: 'No category data found with that id!' });
    return;
  }
  res.status(200).json(categoryData);
} catch (err) {
  res.status(400).json(err)
}
});

module.exports = router;
