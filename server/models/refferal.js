const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    refferalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "refferalId"
    },
    refferalCode: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "refferalCode"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "userId",
      references: {
        key: "userId",
        model: "user_model"
      }
    }
  };
  // const options = {
  //   tableName: "refferal",
  //   comment: "",
  //   indexes: [{
  //     name: "userId_idx",
  //     unique: false,
  //     type: "BTREE",
  //     fields: ["userId"]
  //   }]
  // };
  const RefferalModel = sequelize.define("refferal", attributes);
  return RefferalModel;
};