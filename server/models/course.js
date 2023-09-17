const {
  DataTypes
} = require('sequelize');
// const model=require("./subject");
// const relation = require('../../relation');
module.exports = sequelize => {
  const attributes = {
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "courseId"
    },
    courseName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "CAT",
      primaryKey: false,
      unique:true,
      autoIncrement: false,
      comment: null,
      field: "courseName"
    },
    courseDesc: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "courseDesc"
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
   const Course = sequelize.define("course", attributes); 
  return Course;
};