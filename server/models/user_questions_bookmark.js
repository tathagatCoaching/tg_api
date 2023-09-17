const {
  DataTypes
} = require('sequelize');


module.exports = sequelize => {
  const attributes = {
    bookmarkId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "bookmarkId"
    },
    testId  : {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "testId"
    },

    userEmailId: {
      type: DataTypes.STRING(255),
      allowNull: false,
       primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "userEmailId"
    },
    questionsId : {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "questionsId"
    },

    status:{
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: "(1=>Bookmark, 0=>NotBookmark)",
      field: "status"
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
    courseName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "courseName"
    },
    subjectName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "subjectName"
    },
    topicName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "topicName"
    },
   
  };


  const options = {
    tableName: 'user_questions_bookmark',
    comment: '',
    indexes: [],
  };
  const userQuestionsBookmark = sequelize.define("user_questions_bookmark", attributes,options);
  return userQuestionsBookmark;
};