'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recipes_ratings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.recipes_ratings.belongsTo(models.recipe)
      models.recipes_ratings.belongsTo(models.chef)

    }
  };
  recipes_ratings.init({
    chefId: DataTypes.INTEGER,
    recipeId: DataTypes.INTEGER,
    rating: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'recipes_ratings',
  });
  return recipes_ratings;
};