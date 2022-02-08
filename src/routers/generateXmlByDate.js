import xmlbuilder from 'xmlbuilder'
import FilledForm from '../modules/filledForm.js';

export default async (date) => {
  try {
    let doc = xmlbuilder.create('forms', { version: '1.0', encoding: 'utf-8' })
      .att('date', date)

    let today = new Date(date);
    let tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate()+1);

    const res = await FilledForm.find({createdAt: {
        $gte: today, 
        $lt: tomorrow
      }})
      .sort({createdAt: 1})
      .then((data) => {

        data.forEach(element => {

          const form = doc.ele('form')
            .att('form_id', element.formID)
            .att('form_name', element.formName)
            .att('id_klient', element.id_klient)
            .att('id_code', element.id_code)
            .att('weight', element.weight)
            .att('full-weight', element.fullWeight)

          const keys = form.ele('keys')

          element.keys.forEach(key => {
            keys.ele('key')
                .att('label', key.label)
                .att('value', key.value)
          })

          const up = keys.up()
          const fields = up.ele('fields')
  
          element.fields.forEach(field => {
            const fieldData = fields.ele('field')
              .att('type', field.type)
              .att('label', field.label)
  
            if (field.weight) fieldData.att('weight', field.weight)
  
            if (Array.isArray(field.value)) {
              const values = fieldData.ele('values')
  
              field.value.forEach(value => {
                values.ele('value')
                  .att('label', value.label)
                  .att('weight', value.weight)
              })
            } else {
              if (field.type === 'file') fieldData.att('value', field.value.filename)
              else fieldData.att('value', field.value)
            }
          });
        });
        
        const xml = doc.end({ pretty: true })
        return { date, xml }
      })

      return res;

  } catch (error) {
    return { error: "Произошла ошыбка загрузки данных" }
  }
}
