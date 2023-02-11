const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async(req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{model: Product, through: ProductTag, as: 'products'}],
    }); 
    return res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model: Product, through: ProductTag, as: 'products'}],
    });
    return res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.productIds.length) {
      const productTagIdArr = req.body.productIds.map((productId) => {
        console.log(productId);
        return {
          product_id: productId,
          tagId: tagData.id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(productTagIds);
    } else {
      //if no product tags, just respond
      res.status(200).json(tagData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    
    //finds all tags specified by :/id, returns an array of objects with tag_id = :/id and its associated product id's
    const associatedTags = await ProductTag.findAll({ where: { tag_id: req.params.id } }); //find all associated products from ProductTag
    //returns an array of the affected ProductTag id's
    const productTagIds = associatedTags.map(({ productId }) => productId);
    //ret
    const newProductTags = req.body.productIds
    .filter((productId) => !productTagIds.includes(productId))
    .map((productId) => {
      return {
        product_id: productId,
        tag_id: req.params.id,
      };
    });

    //returns an array of all ProductTags to be removed (on existing product)
    const productTagsToRemove = associatedTags
    .filter(({ product_id }) => !req.body.productIds.includes(product_id))
    .map(({ id}) => id);
      
    const updatedProductTags = await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);

    res.status(200).json("success");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if(!tagData) {
      res.status(404).json({ message: 'No location found with this id!'});
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;