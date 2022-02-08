import Form from '../../modules/form.js'
import FilledForm from '../../modules/filledForm.js'
import sendEmail from '../function_sendMessage.js'

export default (req, res) => {
  const filledData = req.body
  try {
    const keys = filledData.keys.map((key) => ({ $elemMatch: { label: key.label }}));

    Form.findOne({ unique_id: filledData.id, keys: { $all: keys } }, (err, data) => {
      if (!data || err) return res.send({ error: "Формы не существует" })

      FilledForm.findOne({}).sort({createdAt: -1}).then((lastItem) => {
        const unique_id = (lastItem?.unique_id || 0) + 1
        if (!unique_id) return res.send({ error: "Возникла ошыбка" })

        let formWeight = 0
        let questionCount = 0
        const fields = data.fields.map((field) => {
          // const filledField = filledData.fields.find(filled =>
          //   filled.label.replace("/", "").replace("\\", "") === field.label.replace("/", "").replace("\\", ""));
          const filledField = filledData.fields[questionCount]
          questionCount++
          
          let value = null
          let weight = 0

          if (field.choices) {
            if (Array.isArray(filledField.value) && filledField.value.length) {
              value = filledField.value.map((choiсe) => {
                const finded = field.choices.find(choiсeData =>
                  choiсeData.label.replace("/", "").replace("\\", "").replace(/\s+/g, ' ').trim() === choiсe.replace("/", "").replace("\\", "").replace(/\s+/g, ' ').trim())
                weight += Number.parseInt(finded.weight)
  
                return finded
              })
            } else value = []
          } else {
            value = filledField.value || null
            weight = field.type === 'number' ? Number.parseInt(filledField.value) : null
          }

          formWeight += weight || 0

          return {
            type: field.type,
            label: field.label,
            value,
            weight,
          }

        })
  
        const result = {
          unique_id,
          formID: Number.parseInt(filledData.id),
          formName: data.name,
          id_klient: filledData.id_klient,
          id_code: filledData.id_code,
          weight: formWeight,
          fullWeight: data.weight,
          fields,
          keys: filledData.keys,
        }

        FilledForm.findOne({ id_code: filledData.id_code }, (err, exist) => {

          FilledForm.create(result, (err, data) => {
            if (err || !data) return res.send({ error: "Не удалось отправить форму" })
  
            if (exist) sendEmail(result, "Заполнена форма с одинаковым id_code: " + result.id_code)

            if (!!data.criticalWeight && (data.criticalWeight > result.weight)) {
              sendEmail(result, "Внимание. Получена низкая оценка")
            }
            return res.send({ success: true });
          })
        })

      })
    })
  } catch (error) {
    return res.send({ error: "Возникла ошыбка" })
  }
}
