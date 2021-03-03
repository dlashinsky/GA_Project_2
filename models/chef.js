'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chef extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.chef.hasMany(models.recipes_ratings)
      models.chef.hasMany(models.chefs_pinned_recipes)
      models.chef.hasMany(models.chefs_comments)
      models.chef.belongsToMany(models.cuisine, { through: 'chefs_cuisine_tags'})

    }
  };
  chef.init({
    first_name: DataTypes.TEXT,
    last_name: DataTypes.TEXT,
    email: DataTypes.STRING,
    user_name: DataTypes.STRING,
    password: DataTypes.STRING,
    chef_bio: DataTypes.TEXT,
    experience: DataTypes.TEXT,
    profile_img_url: DataTypes.STRING,
    headline: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'chef',
  });
  return chef;
};