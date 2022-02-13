const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Product.findAll({
    include: [
      {
        model: Category,
        attribute: ['category_name']
      },
      {
        model: Tag,
        attribute: ['tag_name'] 
      }
    ],
  })
  .then((productData) => res.json(productData))
  .catch((err) => {
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  Product.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Category,
        attributes: ['category_name']
      },
      {
        model: Tag,
        attributes: ['tag_name']  
      }
    ],
  })
  .then((productData) => res.json(productData))
  .catch((err) => {
    res.status(500).json(err);
  });
});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then((product) => {
    return ProductTag.findAll({ where: { product_id: req.params.id } });
  })
  .then((productTags) => {
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds
    .filter((tag_id) => !productTagIds.includes(tag_id))
    .map((tag_id) => {
      return {
        product_id: req.params.id,
        tag_id
      };
    });
    const productTagsToRemove = productTags
    .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
    .map(({ id }) => id);
    return Promise.all([
      productTag.destroy({ where: { id: productTagsToRemove} }),
      ProductTag.bulkCreate(newProductTags),
    ]);
  })
  .then((updatedProductTags) => res.json(updatedProductTags))
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
  .then((productData) => {
    if (!productData) {
      res.status(404).json({ message: 'Product does not exist!' });
      return;
    }
    res.json(productData);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
});

module.exports = router;
