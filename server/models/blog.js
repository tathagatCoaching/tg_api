const {
  DataTypes
} = require('sequelize');


module.exports = sequelize => {
  const attributes = {
    _id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "_id"
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      autoIncrement: false,
      comment: null,
      field: "title"
    },
    shortDesc: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: this.title,
      comment: null,
      field: "shortDesc"
    },
    body: {
      type: DataTypes.JSON,
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
      get() {
        const rawValue = this.getDataValue('body');
        return rawValue ? rawValue.q : null;
      },
      field: "body"
    },

    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "thumbnail"
    },
    publisher: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "publisher"
    },
    bookmarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "publisher"
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "publisher"
    },
    comments: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "comments"
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
    tableName: "blogs",
    comment: "",
    indexes: []
  };
  const VideoModel = sequelize.define("blogs", attributes, options);
  return VideoModel;
};