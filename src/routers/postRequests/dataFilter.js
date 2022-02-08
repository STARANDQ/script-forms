import User from '../../modules/user.js'
import FilledForm from '../../modules/filledForm.js'


export default (req, res) => {
  try {
    User.findOne({ unique_id: req.session.userId }, (err, data) => {
      if (err || !data) return res.render('login.ejs', { res })
    })

    const filter = req.body

    const dateQuery = {}
    if (filter.period.from || filter.period.to) dateQuery.createdAt = {}

    if (filter.period.from) dateQuery.createdAt.$gte = new Date(filter.period.from)
    if (filter.period.to) dateQuery.createdAt.$lt = new Date(filter.period.to)

    const result = {
      key: filter.key,
      filled: {}
    }
    
    FilledForm.find({
      ...dateQuery,
      keys: {
        $elemMatch: {
          label: filter.key,
        }
      }
    })
    .sort({createdAt: -1}).then((data) => {

      data.forEach((form) => {
        form.keys.forEach((key) => {

          if (key.label == filter.key) {
            if (!result.filled[key.value])
              result.filled[key.value] = {
                id: form.unique_id,
                formID: form.formID,
                formWeight: form.fullWeight,
                weight: 0,
                count: 0,
              }

            if (result.filled[key.value].formWeight < form.fullWeight)
              result.filled[key.value].formWeight = form.fullWeight

            result.filled[key.value].weight += form.weight
            result.filled[key.value].count += 1

            return
          }
        })
      })

      return res.send({ success: true, result })
    })
      
  } catch (error) {
    return res.send({ error: "Произошла ошибка загрузки данных" })
  }
}

// export default (req, res) => {
//   try {
//     User.findOne({ unique_id: req.session.userId }, (err, data) => {
//       if (err || !data) return res.render('login.ejs', { res })
//     })

//     const filter = req.body

//     const dateQuery = {}
//     if (filter.period.from || filter.period.to) dateQuery.createdAt = {}

//     if (filter.period.from) dateQuery.createdAt.$gte = new Date(filter.period.from)
//     if (filter.period.to) dateQuery.createdAt.$lt = new Date(filter.period.to)

//     const result = {
//       key: filter.key,
//       filled: {}
//     }
    
//     Form.find({ 
//       keys: {
//         $elemMatch: {
//           label: filter.key,
//           access: '1',
//         }
//       }
//     }).sort({createdAt: -1}).then((formData) => {
//       console.log(formData);
//       if (!formData) return res.send({ error: "Произошла ошибка загрузки данных" })

//       myPromiseFunction(formData.length, formData, { key: filter.key, dateQuery }, result).then(result => {
//         console.log(result);
//         return res.send({ success: true, result })
//       })
//     })
      
//   } catch (error) {
//     return res.send({ error: "Произошла ошибка загрузки данных" })
//   }
// }

//   function myPromiseFunction(number, formData, filter, result) {
//     return new Promise(async function(resolve, reject) {
//       if(number === 0){
//         resolve(result);
//       }else{
//         FilledForm.find({ formID: +(formData[number-1].unique_id), ...filter.dateQuery })
//         .sort({createdAt: -1}).then((data) => {

//           data.forEach((form) => {
//             form.keys.forEach((key) => {
  
//               if (key.label == filter.key) {
//                 if (!result.filled[key.value])
//                   result.filled[key.value] = {
//                     weight: 0,
//                     count: 0,
//                     formWeight: +(formData[number-1].weight),
//                   }
  
//                 result.filled[key.value].weight += form.weight
//                 result.filled[key.value].count += 1
//                 return
//               }
//             })
//           })

//           resolve(myPromiseFunction(number-1, formData, filter, result));
//         })

//       }
//     });
//   }