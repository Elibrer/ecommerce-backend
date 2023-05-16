const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, as : 'tagged_products', attributes: ['id', 'product_name', 'price', 'stock', 'category_id'], through: { attributes: []}}]
    })
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try { 
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, as : 'tagged_products', attributes: ['id', 'product_name', 'price', 'stock', 'category_id'], through: { attributes: []}}]
    })
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  /* req.body should look like this...
  {
    "tag_name": "orange",
    "productIds": [ 4, 7 ]
  }
  productIds references existing products that may also have the new tag attached to them.
  */
  try {
    const tagData = await Tag.create(req.body)

    if (req.body.productIds.length) {
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: tagData.id,
          product_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(200).json({ message: 'Tag created successfully:', tag: tagData });
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  try {
    await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    const taggedProducts = await ProductTag.findAll({ where: { tag_id: req.params.id } });
    // get list of current product_ids
    const taggedProductsIds = taggedProducts.map(({ product_id }) => product_id);
    // create filtered list of new tag_ids
    const newTaggedProducts = req.body.productIds
      .filter((product_id) => !taggedProductsIds.includes(product_id))
      .map((product_id) => {
        return {
          tag_id: req.params.id,
          product_id,
        };
      });
    // figure out which ones to remove
    const taggedProductsToRemove = taggedProducts
      .filter(({ product_id }) => !req.body.productIds.includes(product_id))
      .map(({ id }) => id);
    // run both actions
    await Promise.all([
      ProductTag.destroy({ where: { id: taggedProductsToRemove } }),
      ProductTag.bulkCreate(newTaggedProducts),
    ]);
    res.status(200).json({ message: 'Tag updated successfully', updatedInfo: req.body });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tagName = await Tag.findByPk(req.params.id)
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
  })
  if (!tagData) {
    res.status(404).json({ message: 'No category data found with that id!' });
    return;
  }
  res.status(200).json({ message: `Deleted the tag '${tagName.tag_name}' with id: ${tagName.id}`});
} catch (err) {
  res.status(400).json(err)
}
});

module.exports = router;
