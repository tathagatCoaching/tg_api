const {
  DataTypes
} = require('sequelize');
// const db = require('../db');
// const relation = require('../relation');
module.exports = sequelize => {
  const attributes = {
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "courseId"
    },
    courseName: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "courseName"
    },
    courseDesc: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "courseDesc"
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "date"
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "questionId",
      references: {
        key: "questionId",
        model: "question_model"
      }
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "subjectId",
      references: {
        key: "subjectId",
        model: "subject_model"
      }
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "topicId",
      references: {
        key: "topicId",
        model: "topic_model"
      }
    }
  };
  const options = {
    tableName: "couse",
    comment: "",
    indexes: [{
      name: "questionId_idx",
      unique: false,
      type: "BTREE",
      fields: ["questionId"]
    }, {
      name: "subjectId_idx",
      unique: false,
      type: "BTREE",
      fields: ["subjectId"]
    }, {
      name: "topicId_idx",
      unique: false,
      type: "BTREE",
      fields: ["topicId"]
    }]
  };
  const CouseModel = sequelize.define("couse", attributes, options);
  return CouseModel;
};