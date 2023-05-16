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
    if (!categoryById) {
      res.status(404).json({ message: 'No category data found with that id!' });
      return;
    }
    res.status(200).json(categoryById)
  } catch (err) {
      res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  /* req.body should look like this...
  {
    "category_name": "Watches"
  }
  productIds references existing products that may also have the new tag attached to them.
  */
  try {
      const categoryData =  await Category.create(req.body)
      res.status(200).json({ message: "Category created successfully:", category: categoryData });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id);
    categoryData.set(req.body);
    await categoryData.save();
    res.status(200).json({ message: "Category updated successfully:", category: categoryData });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const categoryName = await Category.findByPk(req.params.id)
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
  })
  if (!categoryData) {
    res.status(404).json({ message: 'No category data found with that id!' });
    return;
  }
  res.status(200).json({ message: `Deleted the category '${categoryName.category_name}' with id: ${categoryName.id}`});
} catch (err) {
  res.status(400).json(err)
}
});

module.exports = router;
