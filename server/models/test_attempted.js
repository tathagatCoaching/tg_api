const {
  DataTypes
} = require('sequelize');


module.exports = sequelize => {
  
  const attributes = {

    attempt_id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "attempt_id"
    },

    userId: {
      type: DataTypes.STRING,
      field: "userId"
    },

    testId: {
      type: DataTypes.STRING,
      field: "testId"
    },

    packageId: {
      type: DataTypes.STRING,
      field: "packageId"
    },

    testResult:{
      type:DataTypes.JSON,
      field:"testResult"
    },

    full_attempt :{
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: "full_attempt"
    }, 

    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "submitted_at"
    },

    status:{
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: "(1=>Activated, 2=>Deactivated, 3=>Deleted)",
      field: "status"
    }

  };

  const options = {
    tableName: 'test_attempted',
    comment: '',
    indexes: [],
  };

  const sqltModel = sequelize.define("test_attempted", attributes, options);
  return sqltModel;
};