'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.recipe.hasMany(models.recipes_ratings)
      models.recipe.hasMany(models.chefs_pinned_recipes)
      models.recipe.hasMany(models.chefs_comments)
     

    }
  };
  recipe.init({
    idMeal: DataTypes.INTEGER,
    title: DataTypes.STRING,
    image_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'recipe',
  });
  return recipe;
};