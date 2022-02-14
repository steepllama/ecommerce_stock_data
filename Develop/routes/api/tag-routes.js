const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', (req, res) => {
  Tag.findAll({
    include: {
      model: Product,
    }
  })
  .then((tagData) => res.json(tagData))
  .catch((err) => {
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: Product
    }
  })
  .then((TagData) => res.json(TagData))
  .catch((err) => {
    res.status(500).json(err);
  });
});

router.post('/', (req, res) => {
  Tag.create({
    tag_name: req.body.tag_name
  })
  .then((tagData) => res.json(tagData))
  .catch((err) => {
    res.status(500).json(err);
  });
});

router.put('/:id', (req, res) => {
  Tag.update(
    {
      tag_name: req.body.tag_name
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then((tagData) => {
    if (!tagData) {
      res.status(404).json({ message: 'Tag does not exist!' });
      return;
    }
    res.json(tagData);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
});

router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then((tagData) => {
    if (!tagData) {
      res.status(404).json({ message: 'Tag does not exist!' });
      return;
    }
    res.json(tagData);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
});

module.exports = router;
