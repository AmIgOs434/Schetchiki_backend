const uuid = require('uuid')
const path = require('path');
const { Basket_Item, Order_item, Order, Item, Categoria, User, Schetchik, Schetchik_data } = require('../models/models')
const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken')
const { Op, where } = require('sequelize');
const fs = require('node:fs');
const FormData = require('form-data');
var request = require('request');
const axios = require('axios')
const generateJwt = (id) => {
  return jwt.sign(
      {id},
      process.env.SECRET_KEY,
      {expiresIn: "24h"}
  )
}

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class deviceController {


async reg(req, res, next) {

      const {number_schet,password,email} = req.body
      const schetchik = await axios.get(`http://адресзаказчика/systema_base1/hs/KVKAPI_AUTHORIZATION/AUTHORIZATION/${number_schet}`)

      console.log(schetchik.data)
      console.log(schetchik)

      if(schetchik.data=='Пользователя нет в базе водоканала'){
        return res.json(schetchik.data)
      }else{
      // const user_0 = await User.create({
      //   number_schet: number_schet, 
      //   password:password,
      //   email:email
      // })
      // const token = generateJwt(user_0.id)
      return res.json('token')
      }


  }


async auth(req, res, next) {

  const {number_schet,password} = req.body
  const user_0 = await User.findOne(
 {  

  where:{number_schet:number_schet}

}
  )
   if (user_0?.password==password){
    console.log('верно')
    const token = generateJwt(user_0.id)
    console.log(user_0.id)
    return res.json(user_0.id)
   }else{
    console.log('Неверный логин или пароль')
    return res.json('Неверный логин или пароль')
   }

}


async getSchetchiki(req, res) {
  const {UserId} = req.body
  const video = await Schetchik.findAll({
    where:{UserId:UserId},
    include: [{model: Schetchik_data, as: 'Schetchik_data', where:{select:0}}]
  });
  return res.json(video)
}

async getSchetchik_data(req, res) {
  const {SchetchikId} = req.body
  const video = await Schetchik_data.findAll({
    where: {SchetchikId:SchetchikId,
      select:0},
  });
  return res.json(video)
}


async getSchetchik_data_one(req, res) {
  const {id} = req.body
  const video = await Schetchik_data.findOne({
    where: {id:id},
  });
  return res.json(video)
}


async createSchetchiki(req, res) {
  const {number_schet,name,photo,zadolz_po_schetchiku,data,name1,UserId,latitude,longitude,namePhoto} = req.body
  console.log(photo)




  var base64Data = photo.split(",")[1];// split with `,`

   const aa = require("fs").writeFile(`./static/${namePhoto}.jpeg`, base64Data, 'base64', 
   async function(err, data) {
       if (err) {
      console.log('err', err);
         }
         let stats = fs.statSync(`./static/${namePhoto}.jpeg`)

      

         const form = new FormData();
         form.append('image', fs.createReadStream(`./static/${namePhoto}.jpeg`));
try{
    

         await axios.post('http://адрес:8000/upload-image/', form,{
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }).then(async function(response20) {
  const Schetchik_ = await Schetchik.create({
    name:name1,
    UserId:UserId
  })
                const resp = await  axios.get('http://адрес:8000/api/data/?limit=1005')
                .then(async function(response1) {
                  console.log('response1')
                 console.log(response1.data.count)
                 console.log(response1.data.results[response1.data.count-1]['meter'])
                 console.log(response1.data.results[response1.data.count-1]['qr']==[])
                 const opo1 = await axios.post(`http://адресзаказчика/systema_base1/hs/KVK_API_NEWMETER/CREATENEWMETER/${UserId}/${Schetchik_.id}`).then(async function(response2) {
        
                 console.log(response2)
                 if(response1.data.results[response1.data.count-1]['qr']==[]){
                  const opo = await axios.post(`http://адресзаказчика/systema_base1/hs/KVK_API_NEWREPORT/CREATENEWREPORT/${UserId}/${Schetchik_.id}/${response1.data.results[response1.data.count-1]['meter']}/0000000`).then(async function(response3) {
        
                  const Schetchik1 = await Schetchik_data.create({
                    number_schet:number_schet,
                    name:name,
                    photo:`/${namePhoto}.jpeg`,
                    zadolz_po_schetchiku:response3.data.arrears,
                    data:data,
                    SchetchikId:Schetchik_.id,
                    latitude:latitude,
                    longitude:longitude,
                    unpaid:response3.data.unpaid,
                    arrears:response3.data.arrears,
                    meterdata:response3.data.meterdata,
        
                  });
                  
                  console.log(response3.data)
                  return res.json(Schetchik1)
                 })
            
                }else{
                const opo = await axios.post(`http://адресзаказчика/systema_base1/hs/KVK_API_NEWREPORT/CREATENEWREPORT/${UserId}/${Schetchik_.id}/${response1.data.results[response1.data.count-1]['meter']}/${response1.data.results[response1.data.count-1]['qr']}`).then(async function(response3) {
                  const Schetchik1 = await Schetchik_data.create({
                    number_schet:number_schet,
                    name:name,
                    photo:`/${namePhoto}.jpeg`,
                    zadolz_po_schetchiku:response3.data.arrears,
                    data:data,
                    SchetchikId:Schetchik_.id,
                    latitude:latitude,
                    longitude:longitude,
                    unpaid:response3.data.unpaid,
                    arrears:response3.data.arrears,
                    meterdata:response3.data.meterdata,
        
                  });
                console.log(response3.data)  
                return res.json(Schetchik1)
        
                })
              }
        
            })
        
               
                }).catch(function(error) {
                  console.log(error)
                  console.log('response1')
                })

              })


     
      
}catch{
    return res.json('Ошибка загрузки фото в нейросеть')
}


              
      }
        )
        

 

}

async createSchetchiki1(req, res) {
  const {number_schet,name,photo,zadolz_po_schetchiku,data,SchetchikId,latitude,longitude,namePhoto,UserId} = req.body


 console.log(SchetchikId)
  var base64Data = photo.split(",")[1];// split with `,`

   const aa = require("fs").writeFile(`./static/${namePhoto}.jpeg`, base64Data, 'base64', 
   async function(err, data) {
       if (err) {
      console.log('err', err);
         }
         let stats = fs.statSync(`./static/${namePhoto}.jpeg`)

         const form = new FormData();
         form.append('image', fs.createReadStream(`./static/${namePhoto}.jpeg`));
try{

         
         await axios.post('http://адрес:8000/upload-image/', form,{
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }).then(async function(response20) {

                const resp = await  axios.get('http://адрес:8000/api/data/?limit=1005')
                .then(async function(response1) {
                  console.log('response1')
                 console.log(response1.data.count)
                 console.log(response1.data.results[response1.data.count-1]['meter'])
                 console.log(response1.data.results[response1.data.count-1]['qr']==[])
        
                 
                 if(response1.data.results[response1.data.count-1]['qr']==[]){
                  const user12 = await User.findOne({
                    where:{id:UserId}
                  })
                  const user122 = await Schetchik.findOne({
                    where:{id:SchetchikId}
                  })
                  console.log(user12.number_schet)
                  console.log(user12)
                  console.log(user122.name.slice(6,1000))
                  console.log(user122)

                  const opo = await axios.post(`http://адресзаказчика/systema_base1/hs/KVK_API_NEWREPORT/CREATENEWREPORT/${user12.number_schet}/${Number(user122.name.slice(6,1000))}/${response1.data.results[response1.data.count-1]['meter']}/0000000`).then(async function(response3) {
        
                  const Schetchik1 = await Schetchik_data.create({
                    number_schet:number_schet,
                    name:name,
                    photo:`/${namePhoto}.jpeg`,
                    zadolz_po_schetchiku:response3.data.arrears,
                    data:data,
                    SchetchikId:SchetchikId,
                    latitude:latitude,
                    longitude:longitude,
                    unpaid:response3.data.unpaid,
                    arrears:response3.data.arrears,
                    meterdata:response3.data.meterdata,
        
                  });
                  
                  console.log(response3.data)
                  return res.json(Schetchik1)
                 })
            
                }else{
                const opo = await axios.post(`http://адресзаказчика/systema_base1/hs/KVK_API_NEWREPORT/CREATENEWREPORT/${UserId}/${SchetchikId}/${response1.data.results[response1.data.count-1]['meter']}/${response1.data.results[response1.data.count-1]['qr']}`).then(async function(response3) {
                  const Schetchik1 = await Schetchik_data.create({
                    number_schet:number_schet,
                    name:name,
                    photo:`/${namePhoto}.jpeg`,
                    zadolz_po_schetchiku:response3.data.arrears,
                    data:data,
                    SchetchikId:SchetchikId,
                    latitude:latitude,
                    longitude:longitude,
                    unpaid:response3.data.unpaid,
                    arrears:response3.data.arrears,
                    meterdata:response3.data.meterdata,
        
                  });
                console.log(response3.data)  
                return res.json(Schetchik1)
        
                })
              }
        
            })
        
               
                }).catch(function(error) {
                  console.log(error)
                  console.log('response1')
                })

              

            }catch{
              return res.json('Ошибка загрузки фото в нейросеть')
          }
     
      



      
      }
        )
        

 

}
async createSchetchiki_by_data(req, res) {
  const {number_schet,name,photo,zadolz_po_schetchiku,data,SchetchikId} = req.body
  const Schetchik1 = await Schetchik_data.create({
    number_schet:number_schet,
    name:name,
    photo:photo,
    zadolz_po_schetchiku:zadolz_po_schetchiku,
    data:data,
    SchetchikId:SchetchikId
  });
  fs.writeFile("/test.jpg", photo, "binary", function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });


  return res.json(Schetchik1)
}



}

module.exports = new deviceController()