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
      const user_0 = await User.create({
        number_schet: number_schet, 
        password:password,
        email:email
      })
      const token = generateJwt(user_0.id)
      return res.json(user_0.id)
  }


async auth(req, res, next) {

  const {number_schet,password} = req.body
  const user_0 = await User.findOne(
 {  

  where:{number_schet:number_schet}

}
  )
   if (user_0.password==password){
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
    include: [{model: Schetchik_data, as: 'Schetchik_data'}]
  });
  return res.json(video)
}

async getSchetchik_data(req, res) {
  const {SchetchikId} = req.body
  const video = await Schetchik_data.findAll({
    where: {SchetchikId:SchetchikId},
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
  const Schetchik_ = await Schetchik.create({
    name:name1,
    UserId:UserId
  })



  var base64Data = photo.split(",")[1];// split with `,`

   const aa = require("fs").writeFile(`./static/${namePhoto}.jpeg`, base64Data, 'base64', 
   async function(err, data) {
       if (err) {
      console.log('err', err);
         }
         let stats = fs.statSync(`./static/${namePhoto}.jpeg`)

        //  const resp1 = await axios.post('http://79.174.92.222:8000/upload-image/',formData)
        //     .then(function(response1) {
        //       console.log('response1')
        //      console.log(response1)
        //      return
        //     }).catch(function(error) {
        //       console.log(error)
        //       console.log('response1')
        //     })
      

         const form = new FormData();
         form.append('image', fs.createReadStream(`./static/sh.jpeg`));

         await axios.post('http://79.174.92.222:8000/upload-image/', form,{
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }).then(async function(response20) {

                const resp = await  axios.get('http://79.174.92.222:8000/api/data/?limit=1005')
                .then(async function(response1) {
                  console.log('response1')
                 console.log(response1.data.count)
                 console.log(response1.data.results[response1.data.count-1]['meter'])
                 console.log(response1.data.results[response1.data.count-1]['qr']==[])
                 const opo1 = await axios.post(`http://s5.oooblako.ru/systema_base1/hs/KVK_API_NEWMETER/CREATENEWMETER/${UserId}/${Schetchik_.id}`).then(async function(response2) {
        
                 console.log(response2)
                 if(response1.data.results[response1.data.count-1]['qr']==[]){
                  const opo = await axios.post(`http://s5.oooblako.ru/systema_base1/hs/KVK_API_NEWREPORT/CREATENEWREPORT/${UserId}/${Schetchik_.id}/${response1.data.results[response1.data.count-1]['meter']}/0000000`).then(async function(response3) {
        
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
                const opo = await axios.post(`http://s5.oooblako.ru/systema_base1/hs/KVK_API_NEWREPORT/CREATENEWREPORT/${UserId}/${Schetchik_.id}/${response1.data.results[response1.data.count-1]['meter']}/${response1.data.results[response1.data.count-1]['qr']}`).then(async function(response3) {
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


     
      



               



        //  var formData = new FormData();   
        //  URL = "http://localhost:5002/file.png";    
        //  var x;
         
        //  var request = new XMLHttpRequest()
        //  request.responseType = "blob"
        //  request.onload = function() {
        //    formData.append("image", request.response);
        //    x = new XMLHttpRequest();
        //    x.open("POST","http://79.174.92.222:8000/upload-image/",true);
        //    x.setRequestHeader("Content-type", "multipart/form-data");
        //    x.setRequestHeader("Content-Length", formData.length);
        //    x.send(formData);
        //  }
        //  request.open("GET", URL);
        //  request.send();









        //  const form = new FormData();
        //  form.append('image', fs.createReadStream(`./static/${namePhoto}.jpeg`));

        // await axios.post('http://79.174.92.222:8000/upload-image/', form,{
        //         headers: {
        //           'Content-Type': 'multipart/form-data'
        //         }
        //       }).then(({data})=> console.log(data));


        //  const resp = await axios.post('http://79.174.92.222:8000/upload-image/',form)
        //     .then(function(response1) {
        //       console.log('response1')
        //      console.log(response1)
        //     }).catch(function(error) {
        //       console.log(error)
        //       console.log('response1')
        //     })
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

        //  const resp1 = await axios.post('http://79.174.92.222:8000/upload-image/',formData)
        //     .then(function(response1) {
        //       console.log('response1')
        //      console.log(response1)
        //      return
        //     }).catch(function(error) {
        //       console.log(error)
        //       console.log('response1')
        //     })
      

         const form = new FormData();
         form.append('image', fs.createReadStream(`./static/sh.jpeg`));

         await axios.post('http://79.174.92.222:8000/upload-image/', form,{
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }).then(async function(response20) {

                const resp = await  axios.get('http://79.174.92.222:8000/api/data/?limit=1005')
                .then(async function(response1) {
                  console.log('response1')
                 console.log(response1.data.count)
                 console.log(response1.data.results[response1.data.count-1]['meter'])
                 console.log(response1.data.results[response1.data.count-1]['qr']==[])
                 const opo1 = await axios.post(`http://s5.oooblako.ru/systema_base1/hs/KVK_API_NEWMETER/CREATENEWMETER/${UserId}/${SchetchikId}`).then(async function(response2) {
        
                 
                 if(response1.data.results[response1.data.count-1]['qr']==[]){
                  const opo = await axios.post(`http://s5.oooblako.ru/systema_base1/hs/KVK_API_NEWREPORT/CREATENEWREPORT/${UserId}/${SchetchikId}/${response1.data.results[response1.data.count-1]['meter']}/0000000`).then(async function(response3) {
        
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
                  О
                  console.log(response3.data)
                  return res.json(Schetchik1)
                 })
            
                }else{
                const opo = await axios.post(`http://s5.oooblako.ru/systema_base1/hs/KVK_API_NEWREPORT/CREATENEWREPORT/${UserId}/${SchetchikId}/${response1.data.results[response1.data.count-1]['meter']}/${response1.data.results[response1.data.count-1]['qr']}`).then(async function(response3) {
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

              })


     
      



               



        //  var formData = new FormData();   
        //  URL = "http://localhost:5002/file.png";    
        //  var x;
         
        //  var request = new XMLHttpRequest()
        //  request.responseType = "blob"
        //  request.onload = function() {
        //    formData.append("image", request.response);
        //    x = new XMLHttpRequest();
        //    x.open("POST","http://79.174.92.222:8000/upload-image/",true);
        //    x.setRequestHeader("Content-type", "multipart/form-data");
        //    x.setRequestHeader("Content-Length", formData.length);
        //    x.send(formData);
        //  }
        //  request.open("GET", URL);
        //  request.send();









        //  const form = new FormData();
        //  form.append('image', fs.createReadStream(`./static/${namePhoto}.jpeg`));

        // await axios.post('http://79.174.92.222:8000/upload-image/', form,{
        //         headers: {
        //           'Content-Type': 'multipart/form-data'
        //         }
        //       }).then(({data})=> console.log(data));


        //  const resp = await axios.post('http://79.174.92.222:8000/upload-image/',form)
        //     .then(function(response1) {
        //       console.log('response1')
        //      console.log(response1)
        //     }).catch(function(error) {
        //       console.log(error)
        //       console.log('response1')
        //     })
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
// async login(req, res, next) {
//   const {email} = req.body
//   const user = await User.findOne({where: {email:email}})

//   if (user===null) {
//     return res.json('Пользователь не найден')
//   }

//   // let comparePassword = password==user.Пароль
//   // if (!comparePassword) {
//   //     return   res.json('Указан неверный пароль')
//   // }

//   const token = generateJwt(user.id)
//   return res.json({token})
// }


//   async getUser(req, res) {
//     const {id} = req.params
//     const user = await User.findOne(
//         {
//             where: {id:id},
//             include: [{model: Sessia, as: 'Sessia'}],

//         },
//     )
//     return res.json(user)
// }

// async getSessia(req, res) {
//   const {id} = req.params
//   const user = await Sessia.findOne(

//       {
//           where: {id:id},
//           include: [{model: Portfolio, as: 'Portfolio' ,include: [{model: Portfolios_img, as: 'Portfolios_img'}] },{model: Video, as: 'Video'}]
//       }
//   )
//   return res.json(user)
// }

// async getVideo(req, res) {
//   const video = await Video.findAll({
//     limit: 5,
//     where: {
//       id: {
//         [Op.not]: [5,4]
//       }
//     }

//   });
//   return res.json(video)
// }



// async createUser(req, res, next) {
//   try {
//       let { author, authorLink,SessiumId,name,sessiaImg,tags,tema} = req.body
//       const prosmotri = 0
//       const dostup = 0
//       const {video} = req.files
//       let fileName = uuid.v4() + ".mp4"
//       video.mv(path.resolve(__dirname, '..', 'static', fileName))
     
//       const device = await Video.create({prosmotri, author, authorLink, videoURL: fileName,SessiumId,name,sessiaImg,tags,tema,dostup});
//       return res.json(device)
//   } catch (e) {
//       next(ApiError.badRequest(e.message))
//   }
// }


// async createBasketItem(req, res, next) {
//   try {
//       let {       
//           opisaniye,
//         number,
//         img,
//         price,
//         all_price,
//         name,
//         comment,
//         UserId,
//         ItemsId} = req.body
//       const device = await Basket_Item.create({
//         opisaniye,
//         number,
//         img,
//         price,
//         all_price,
//         name,
//         comment,
//         UserId,
//         ItemsId
//       });
//       return res.json(device)
//   } catch (e) {
//       next(ApiError.badRequest(e.message))
//   }
// }




// async createOrderItem(req, res, next) {
//   try {
//       let {
// opisaniye,
// number,
// img,
// price,
// all_price,
// name,
// comment,
// OrderId
//        } = req.body
//       const device = await Order_item.create({

//         opisaniye,
// number,
// img,
// price,
// all_price,
// name,
// comment,
// OrderId
//       });
//       return res.json(device)
//   } catch (e) {
//       next(ApiError.badRequest(e.message))
//   }
// }


// async createOrder(req, res, next) {
//   try {
//       let {
//         name,
// price,
// date,
// status,
// all_price,
// comment,
// UserId,
// type_dost,
// adress,
// time
//        } = req.body
//       const device = await Order.create({
//         name,
// price,
// date,
// status,
// all_price,
// comment,
// UserId,
// type_dost,
// adress,
// time
//       });
//       return res.json(device)
//   } catch (e) {
//       next(ApiError.badRequest(e.message))
//   }
// }

// async creatCategoria(req, res, next) {
//   try {
//       let {name } = req.body
//       const device = await Categoria.create({name});
//       return res.json(device)
//   } catch (e) {
//       next(ApiError.badRequest(e.message))
//   }
// }

// async creatItem(req, res, next) {
//   try {
//       let { 
//         name,
// opisaniye,
// kkal,
// belki,
// ziri,
// uglevodi,
// ves,
// price,
// img,
// CategoriumId
//       } = req.body
//       const device = await Item.create({
//         name,
// opisaniye,
// kkal,
// belki,
// ziri,
// uglevodi,
// ves,
// price,
// img,
// CategoriumId
//       });
//       return res.json(device)
//   } catch (e) {
//       next(ApiError.badRequest(e.message))
//   }
// }
// async getCategoria(req, res, next) {
//   try {

//       const device = await Categoria.findAll({

//         include: [{model: Item, as: 'Item'}],

//       });
//       return res.json(device)
//   } catch (e) {
//       next(ApiError.badRequest(e.message))
//   }
// }
// async getOrder(req, res, next) {
//   try {
//      const {id} = req.body
//       const device = await Order.findAll({
//         where:{ UserId:id},
//         include: [{model: Order_item, as: 'Order_item'}],

//       });
//       return res.json(device)
//   } catch (e) {
//       next(ApiError.badRequest(e.message))
//   }
// }
// async getItemById(req, res, next) {
//   try {
//     let {UserId,ItemsId} = req.body
//       const device = await Basket_Item.findOne({

//         where: {
//           UserId:UserId,
//           ItemsId:ItemsId,
//         }

//       });
//       return res.json(device)
//   } catch (e) {
//       next(ApiError.badRequest(e.message))
//   }
// }
// async getAllItemByUserId(req, res, next) {
//   try {
//     let {UserId,ItemsId} = req.body
//       const device = await Basket_Item.findAll({

//         where: {
//           UserId:UserId,
//         }

//       });
//       return res.json(device)
//   } catch (e) {
//       next(ApiError.badRequest(e.message))
//   }
// }
// async updateOneBasketItemPlus (req, res) {
//   const {id} =  req.body
//   const basket1 = await Basket_Item.findOne(
//     {
//       where: {id:id} 
//   }
//   )
//   const basket2 = parseInt(basket1.dataValues.number)
  
//   const basket =  await Basket_Item.update(
//   {
//     number: basket2+1,
      
//   },
//   {
//       where: {id:id} 
//   }
  
//   )

//   if (basket) {
//       return res.status(206).send('Basket updated successfully ');
//     }throw new Error('Product not found');
//   } catch (error) {
//     return res.status(500).send(error.message);
// }
// async updateOneBasketItemMinus (req, res) {
//   const {id} =  req.body
//   const basket1 = await Basket_Item.findOne(
//     {
//       where: {id:id} 
//   }
//   )
//   const basket2 = parseInt(basket1.dataValues.number)
  
//   const basket =  await Basket_Item.update(
//   {
//     number: basket2-1,
      
//   },
//   {
//       where: {id:id} 
//   }
  
//   )

//   if (basket) {
//       return res.status(206).send('Basket updated successfully ');
//     }throw new Error('Product not found');
//   } catch (error) {
//     return res.status(500).send(error.message);
// }
// async deleteBasketDevice (req, res) {
//   try {
//     const { id } = req.body;
//     const deletedProduct1 = await Basket_Item.destroy({
//       where: { id: id },
//     });


//     if (deletedProduct1) {
//       return res.status(204).send('Product deleted successfully ');
//     }

//     throw new Error('Product not found');
//   } catch (error) {
//     return res.status(500).send(error.message);
//   }
// };

  


}

module.exports = new deviceController()