const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "id"
    },
    
    type_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      uniqueKey: true,
      comment: null,
      field: "type_id"
    },
    
    type_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: false,
      comment: null,
      field: "type_name"
    }, 
    isMultiSection: {
      type: DataTypes.INTEGER,
      comment: null,
      field: "isMultiSection"
    },
    level: {
      type: DataTypes.INTEGER,
      comment: null,
      field: "level"
    },
    sort_order: {
      type: DataTypes.INTEGER,
      field: "sort_order"
    },
    status:{
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: "status"
    },
  };
  const options = {
    tableName: "test_type",
    comment: "",
    indexes: []
  };
  const TestTypeModel = sequelize.define("test_type", attributes, options);
  return TestTypeModel;
};