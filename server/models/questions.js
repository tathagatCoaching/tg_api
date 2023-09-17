const {
  DataTypes
} = require('sequelize');
// const db = require('../db');
// const relation = require('../relation');
module.exports = sequelize => {
  const attributes = {
    questionId: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "questionId"
    },
    chapterName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "test"

    },

    questionDesc: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      get() {
        const rawValue = this.getDataValue('questionDesc');
        return rawValue ? rawValue.q : null;
      },
      field: "questionDesc"
    },
    question: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      get() {
        const rawValue = this.getDataValue('question');
        return rawValue ? rawValue.q : null;
      },
      field: "question"
    },


    Desc: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Desc"
    },
    questionType: {
      type: DataTypes.STRING(60),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "questionType"
    },
    questionmedia: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "questionmedia"
    },
    questionoption: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "questionoption"
    },
    explantation: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      // get() {
      //   const rawValue = this.getDataValue('explantation');
      //   return rawValue ? rawValue.q : null;
      // },
      field: "explantation"
    },
    correctoption: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "correctoption"
    },
    optionType: {
      type: DataTypes.STRING(60),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "optionType"
    },
    questionLevel: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "questionLevel"
    },
    paragraph: {
      type: DataTypes.JSON,
      get() {
        const rawValue = this.getDataValue('paragraph');
        return rawValue ? rawValue.q : null;
      },
      field: "paragraph"
    },
    paragraphmedia: {
      type: DataTypes.JSON,
      field: "paragraphmedia"
    },
    QueimgId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "QueimgId"
    },
    creator: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "creator"
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
    }
  };
  const options = {
    tableName: "questions",
    comment: "",
    indexes: [{
      name: "imageId_idx",
      unique: false,
      type: "BTREE",
      fields: ["QueimgId"]
    }]
  };
  const QuestionModel = sequelize.define("questions", attributes, options);
  return QuestionModel;
};