import SETTINGS from '../configs.js' 
import nodemailer from 'nodemailer'
import xmlbuilder from 'xmlbuilder'
import User from '../modules/user.js';

const EmailHost = SETTINGS.email.host;
const EmailPort = SETTINGS.email.port;
const EmailSecure = SETTINGS.email.secure;
const EmailUser = SETTINGS.email.auth.user;
const EmailPassword = SETTINGS.email.auth.pass;
const EmailSender = SETTINGS.email.sender;
const EmailSend = SETTINGS.email.send;

const transporter = nodemailer.createTransport({
	host: EmailHost,
	port: EmailPort,
	secure: EmailSecure, // true for 465, false for other ports
	auth: {
		user: EmailUser,
		pass: EmailPassword
	},
})

const createText = (data) => {
    let text = `Название формы: ${data.formName}\n`
        + `Код клиента: ${data.id_klient}\n`
        + `Код заполениной формы: ${data.id_code}\n`
        + `Вес: ${data.weight}/${data.fullWeight}\n`

    if (data.keys) {
        text += `\nПараметры формы:\n`
        
        data.keys.forEach(key => {
            text += `\t${key.label} ${key.value}\n`
        })
    }

    if (data.fields) {
        text += `\nЗаполненые данные:\n`
        
        data.fields.forEach(field => {
            text += `\t${field.label}:\n`

            if (field.weight)  text += `\t\tВес: ${field.weight}\n`

            if (Array.isArray(field.value)) {
                text += `\t\tОтветы:\n`
                
                field.value.forEach(value => {
                    text += `\t\t\tОтвет: ${value.label}\n`
                        + `\t\t\tВес: ${value.weight}\n`
                })
            } else {
                text += `\t\tОтвет: ${field.value}\n`
            }
        })
    }

    return text
} 
const createHtml = (data) => {
    let html = '<html>'
        + `<div><b>Название формы:</b> ${data.formName}</div>`
        + `<div><b>Код клиента:</b> ${data.id_klient}</div>`
        + `<div><b>Код заполениной формы:</b> ${data.id_code}</div>`
        + `<div><b>Вес:</b> ${data.weight}/${data.fullWeight}</div>`

    if (data.keys) {
        html += `<ul><div><b>Параметры формы:</b></div>`
        
        data.keys.forEach(key => {
            html += `<li><b>${key.label}:</b> ${key.value}</li>`
        })

        html += `</ul>`
    }

    if (data.fields) {
        html += `<ul><div><b>Заполненые данные:</b></div>`
        
        data.fields.forEach(field => {
            html += `<li><b>${field.label}:</b><ul>`

            if (field.weight)  html += `<li><b>Вес:</b> ${field.weight}</li>`

            if (Array.isArray(field.value)) {
                html += `<li><b>Ответы:</b>`
                    +`<ul>`
                
                field.value.forEach(value => {
                    html += `<li><b>Ответ:</b> ${value.label}</li>`
                        + `<li><b>Вес:</b> ${value.weight}</li>`
                })

                html += `</ul>`
            } else {
                html += `<li><b>Ответ:</b> ${field.value}</li>`
            }
            html += `</ul>`
        })
        
        html += `</ul>`
    }
    html += `</html>`

    return html
} 

export default async function(data, subject) {
    const text = createText(data)
    const html = createHtml(data)

    User.findOne({supervisor: true}, async (err, user) => {

        if(EmailSend) await transporter.sendMail({
            from: EmailSender, // sender address
            to: user.email, // list of receivers
            subject, // Subject line
            html,
            text,
        });
        else console.log("Sending messages is disabled in the settings!")
    })
};