const {
    DataTypes
  } = require('sequelize');
  // const model=require("./subject");
  // const relation = require('../../relation');
  module.exports = sequelize => {
    const attributes = {
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "Id"
      },orderNumber:{
         type:DataTypes.INTEGER(11),
         primaryKey:true,
         autoIncrement:true,
         field:"orderNumber"
      }
    };
     const orderlist = sequelize.define("orderlist", attributes); 
    return orderlist;
  };