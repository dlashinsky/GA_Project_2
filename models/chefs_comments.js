'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chefs_comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.chefs_comments.belongsTo(models.recipe)
      models.chefs_comments.belongsTo(models.chef)

    }
  };
  chefs_comments.init({
    recipeId: DataTypes.INTEGER,
    chefId: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'chefs_comments',
  });
  return chefs_comments;
};