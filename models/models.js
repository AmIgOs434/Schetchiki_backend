const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const User = sequelize.define('User', {
    id:  {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING,defaultValue:'User'},
    number_schet: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    Role: {type: DataTypes.STRING},
    adress: {type: DataTypes.STRING},
    zadolzennost_obch: {type: DataTypes.STRING},
})


const Schetchik = sequelize.define('Schetchik', {
    id:  {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
})


const Schetchik_data = sequelize.define('Schetchik_data', {
    id:  {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    data: {type: DataTypes.STRING},
    photo: {type: DataTypes.STRING},
    number_schet: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    zadolz_po_schetchiku: {type: DataTypes.STRING},
    latitude: {type: DataTypes.STRING},
    longitude: {type: DataTypes.STRING},
    select: {type: DataTypes.INTEGER,defaultValue:1},
    unpaid:{type: DataTypes.STRING},
    arrears:{type: DataTypes.STRING},
    meterdata:{type: DataTypes.STRING},
})


User.hasMany(Schetchik, {as: 'Schetchik'});
Schetchik.belongsTo(User)


Schetchik.hasMany(Schetchik_data, {as: 'Schetchik_data'});
Schetchik_data.belongsTo(Schetchik)


module.exports = {
User,
Schetchik,
Schetchik_data
}
