'use strict'
// const {
//   DataTypes
// } = require('sequelize');
 const Sequelize = require('sequelize');

// const db = require('../config/db');
// db.sequelize = Sequelize;

module.exports = (Sequelize,DataTypes) => {
  const attributes = {
    Id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "subjectId"
    },
    subjectName: {
      type: DataTypes.STRING(245),
      allowNull: false,
      defaultValue:"test",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "subjectName"
    },
    subjectDesc: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "subjectDesc"
    },
   
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('current_timestamp'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "created_at"
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('current_timestamp'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "updated_at"
    },
    // courseName: {
    //   type: DataTypes.STRING(255),
    //   allowNull: false,
    //   field: "courseName"
    // }
    
  };
  // const options = {
  //   tableName: "subject",
  //   comment: "",
  //   indexes: [{
  //     name: "videoId_idx",
  //     unique: false,
  //     type: "BTREE",
  //     fields: ["videoId"]
  //   }, {
  //     name: "questionId_idx",
  //     unique: false,
  //     type: "BTREE",
  //     fields: ["questionId"]
  //   }, {
  //     name: "courseId_idx",
  //     unique: false,
  //     type: "BTREE",
  //     fields: ["courseId"]
  //   }]
  // };
  const Subject = Sequelize.define("subject", attributes);
  return Subject;
};