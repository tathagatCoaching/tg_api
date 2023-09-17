const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    TestId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "Test_Id"
    },
    TestTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "test",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "TestTitle"
    },
    exam_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "exam_type"
    },
    examLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 4,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "examLevel"
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
    SectionRule: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      primaryKey: false,
      comment: null,
      field: "SectionRule"
    }, 
    totaltime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: false,
      comment: null,
      field: "totaltime"
    },
    Section: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Section"
    },
    sorting_order:{
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "sorting_order"
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "instructions"
    },

    //
  };
  const options = {
    tableName: "Test",
    comment: "",
    indexes: []
  };
  const TestModel = sequelize.define("Test", attributes, options);
  return TestModel;
};