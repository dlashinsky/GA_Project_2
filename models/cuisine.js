'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cuisine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.cuisine.belongsToMany(models.chef, { through: 'chefs_cuisine_tags'})
    }
  };
  cuisine.init({
    cuisine_title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cuisine',
  });
  return cuisine;
};