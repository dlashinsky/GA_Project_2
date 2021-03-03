'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chefs_cuisine_tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  chefs_cuisine_tags.init({
    cuisineId: DataTypes.INTEGER,
    chefId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'chefs_cuisine_tags',
  });
  return chefs_cuisine_tags;
};