const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    sessionId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "sessionId"
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "userId"
    },
    macId: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "macId"
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
    tableName: "session",
    comment: "",
    indexes: [{
      name: "userId_idx",
      unique: false,
      type: "BTREE",
      fields: ["userId"]
    }]
  };
  const SessionModel = sequelize.define("session", attributes, options);
  return SessionModel;
};