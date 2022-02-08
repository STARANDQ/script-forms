import FilledForm from '../../modules/filledForm.js'
import Form from '../../modules/form.js'
import User from '../../modules/user.js'

import ExcelJS from 'exceljs/dist/es5/index.js'

export default async (req, res) => {
  User.findOne({ unique_id: req.session.userId }, (err, data) => {
    if (err || !data) return res.render('login.ejs', { res })
  })

  const { filterData, forms: filterFormsIds } = req.body
  const { key: filterKey, period: filterPeriod} = filterData
  const filterForms = filterFormsIds.filter((value, index, self) => {
    return self.indexOf(value) === index;
  })

  const dateQuery = {}
  if (filterPeriod.from || filterPeriod.to) dateQuery.createdAt = {}

  if (filterPeriod.from) dateQuery.createdAt.$gte = new Date(filterPeriod.from)
  if (filterPeriod.to) dateQuery.createdAt.$lt = new Date(filterPeriod.to)

  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();

  // const forms = await Form.find({}).sort({ createdAt: -1 })
  const forms = await Form.find({ unique_id: { $in: filterForms } }).sort({ createdAt: -1 })
  const data = await Promise.all(forms.map(async (form) => ({
    ...form?._doc,
    filledData: await FilledForm.find({ formID: form.unique_id, ...dateQuery }).sort({ createdAt: -1 })
  })))

  data.map((form) => {
    const worksheet = workbook.addWorksheet(form.name);

    const table = worksheet.addTable({
      name: form.name,
      ref: 'A1',
      columns: [
        { name: 'Номер' },
        { name: 'Клиент' },
        { name: 'Дата' },
        { name: 'Вес формы' },
        { name: 'Заполненые значения(вес)' },
      ],
      rows: [],
    });

    form.keys.map((key) => {
      table.addColumn({ name: key.title })
    })
    form.fields.map((field) => {
      table.addColumn({ name: field.label })
    })

    form.filledData.map((elem) => {
      const row = [elem.id_code, elem.id_klient, elem.createdAt.toISOString(), elem.fullWeight, elem.weight]

      elem.keys.map((key) => {
        row.push(key.value)
      })
      elem.fields.map((field) => {
        if (field.type === 'radio') {
          row.push(field.value[0].label)
        } else if (field.type === 'checkbox') {
          const value = field.value.map((el) => el.label).join(', ')
          row.push(value)
        } else if (field.type === 'file') {
          row.push(field.value.filename)
        } else {
          row.push(field.value)
        }
      })
      
      table.addRow(row)
    })
    
    table.commit()
  })
  
  workbook.xlsx.writeBuffer().then(function (data) {
    res.send({ file: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${data.toString('base64')}` })
  });

}
