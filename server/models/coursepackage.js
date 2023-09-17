const {
    DataTypes
  } = require('sequelize');
  // const model=require("./subject");
  // const relation = require('../../relation');
  module.exports = sequelize => {
    const attributes = {

      packageId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "packageId"
      },

      PackageName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "CAT",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "PackageName"
      },

      PackagePrice:{
        type:DataTypes.FLOAT(),
        allowNull:false,
        defaultValue: 0,
        field:"PackagePrice"
      },

      PackageDesc: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "PackageDesc"
      },

      officialDesc: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "officialDesc"
      },

      thumbnail: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "thumbnail"
      },

      StopFlag: {
        type: DataTypes.INTEGER(11),
        defaultValue: "1",
        field: "StopFlag"
      },

      TestList: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "TestList"
      },

      courseCourseId:{
        type: DataTypes.STRING(),
        field: "courseCourseId"
      },

      subjectId:{
        type: DataTypes.STRING(),
        field: "subjectId"
      },

      chapterChapterId:{
        type: DataTypes.STRING(),
        field: "chapterChapterId"
      },

      topicId:{
        type: DataTypes.STRING(),
        field: "topicId"
      },
      
      payment_url:{
        type: DataTypes.STRING(),
        field: "payment_url",
        defaultValue:null,
        allowNull: true,
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
      
      show_to_all: {
        type: DataTypes.INTEGER(11),
        defaultValue: "1",
        field: "show_to_all"
      },
    };
    // const options = {
    //   tableName: "course",
    //   comment: "",
    //   indexes: [{
    //     name: "questionId_idx",
    //     unique: false,
    //     type: "BTREE",
    //     fields: ["questionId"]
    //   }, {
    //     name: "videoId_idx",
    //     unique: false,
    //     type: "BTREE",
    //     fields: ["videoId"]
    //   }]
    // };
     const package = sequelize.define("package", attributes); 
    return package;
  };