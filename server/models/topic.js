const {
  DataTypes
} = require('sequelize');


module.exports = sequelize => {
  const attributes = {
    Id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "topicId"
    },
    topicDesc: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "topicDesc"
    },
  
    topicName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue:"test",
       primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "topicName"
    },
    // subjectName: {
    //   type: DataTypes.STRING(255),
    //   allowNull: false,
      
    // },
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
  //   tableName: "topic",
  //   comment: "",
  //   indexes: [{
  //     name: "subjectId_idx",
  //     unique: false,
  //     type: "BTREE",
  //     fields: ["subjectId"]
  //   }, {
  //     name: "videoId_idx",
  //     unique: false,
  //     type: "BTREE",
  //     fields: ["videoId"]
  //   }, {
  //     name: "questionId_idx",
  //     unique: false,
  //     type: "BTREE",
  //     fields: ["questionId"]
  //   }]
  // };
  const Topic = sequelize.define("topic", attributes);
  return Topic;
};