const {
  DataTypes
} = require('sequelize');
// const db = require('../db');
// const relation = require('../relation');
module.exports = sequelize => {
  const attributes = {
    Id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "email_Id"
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "username"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "password"
    },
    courselist: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "courselist"
    },
    devicelist: {
      type: DataTypes.STRING(245),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "devicelist"
    },
   
  };
  // const options = {
  //   tableName: "student",
  //   comment: "",
  //   indexes: []
  // };
  const StudentModel = sequelize.define("student", attributes);
  return StudentModel;
};