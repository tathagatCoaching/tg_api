const {
  DataTypes
} = require('sequelize');


module.exports = sequelize => {

  const attributes = {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "id"
    },

    packagePackageId: {
      type: DataTypes.STRING,
      field: "packagePackageId"
    },

    userEmailId: {
      type: DataTypes.STRING,
      field: "userEmailId"
    },

    created_by: {
      type: DataTypes.STRING,
      field: "created_by"
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

    updated_by: {
      type: DataTypes.STRING,
      field: "updated_by"
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

    status:{
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: "(1=>Activated, 2=>Expired, 3=>Deactivated, 4=>Deleted)",
      field: "status"
    },

  };

  const UserCourseModel = sequelize.define("user_packages", attributes);
  return UserCourseModel;
};