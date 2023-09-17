const {
  DataTypes
} = require('sequelize');
// const db = require('../db');
// const relation = require('../relation');
module.exports = sequelize => {
  const attributes = {
    chapterId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue:DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "chapterId"
    },
    chapterName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "chapterName"
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "2022",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tags"
    },
    chapterDesc: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "chapterDesc"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "created_at"
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "updated_at"
    },
    
    // topicName: {
    //   type: DataTypes.STRING(255),
    //   allowNull: false,
     
    // }
  };
  const options = {
    tableName: "chapters",
    comment: "",
    indexes: []
  };
  const ChaptersModel = sequelize.define("chapters", attributes, options);
  return ChaptersModel;
};