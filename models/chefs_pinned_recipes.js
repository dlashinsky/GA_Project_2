'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chefs_pinned_recipes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.chefs_pinned_recipes.belongsTo(models.recipe)
      models.chefs_pinned_recipes.belongsTo(models.chef)
    }
  };
  chefs_pinned_recipes.init({
    recipeId: DataTypes.INTEGER,
    chefId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'chefs_pinned_recipes',
  });
  return chefs_pinned_recipes;
};