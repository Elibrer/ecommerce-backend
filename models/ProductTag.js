const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    product_tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'product',
            key: 'product_id',
        },
    },
    tag_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'tag',
            key: 'tag_id',
        },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
