import { Router } from 'express'
const router = Router()

import get from './getRequersts/getRequests.js'
import post from './postRequests/postRequests.js'

router.get('/login', (req, res, next) => get.login(req, res))
router.post('/login', (req, res, next) => post.login(req, res))

router.get('/logout', (req, res, next) => get.logout(req, res))

router.get('/profile', (req, res, next) => get.profile(req, res))

router.get('/users', (req, res, next) => get.usersList(req, res))
router.get('/user/*', (req, res, next) => get.editUser(req, res))
router.post('/user/edit', (req, res, next) => post.editUser(req, res))
router.post('/user/delete', (req, res, next) => post.deleteUser(req, res))

router.get('/register', (req, res, next) => get.registerUser(req, res))
router.post('/register', (req, res, next) => post.registerUser(req, res))

router.get('/forms', (req, res, next) => get.formsList(req, res))
router.get('/form/create', (req, res, next) => get.createForm(req, res))
router.post('/form/create', (req, res, next) => post.createForm(req, res))
router.post('/form/delete', (req, res, next) => post.removeForm(req, res))
router.get('/form/*', (req, res, next) => get.editForm(req, res))
router.post('/form/edit', (req, res, next) => post.editForm(req, res))
router.post('/form/fill', (req, res, next) => post.fillFrom(req, res))

router.get('/success', (req, res, next) => get.successMessage(req, res))

router.post('/data', (req, res, next) => post.dataFilter(req, res))
router.get('/downloadData', (req, res, next) => get.downloadData(req, res))
router.post('/dataFile', (req, res, next) => post.downloadData(req, res))
router.get('/getFiles', (req, res, next) => get.getFiles(req, res))
router.post('/generateXml', (req, res, next) => post.generateXml(req, res))

router.post('/getKeys', (req, res, next) => post.getKeys(req, res))
router.post('/getKlients', (req, res, next) => post.getKlients(req, res))

router.get('/filterByKlient', (req, res, next) => get.filterByKlient(req, res))
router.get('/details/:id', (req, res, next) => get.filledform(req, res))
router.post('/filterByKlient', (req, res, next) => post.filterByKlient(req, res))

router.get('/:id', (req, res, next) => {get.getForm(req, res)}); // open form page

export default router