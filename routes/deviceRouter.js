const Router = require('express')

const router = new Router()
const deviceController = require('../controllers/deviceController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')


// router.get('/',checkRole('ADMIN'), deviceController.create)


router.post('/auth', deviceController.auth)
router.post('/reg', deviceController.reg)
router.post('/getSchetchiki', deviceController.getSchetchiki)

router.post('/getSchetchik_data', deviceController.getSchetchik_data)
router.post('/getSchetchik_data_one', deviceController.getSchetchik_data_one)


router.post('/createSchetchiki', deviceController.createSchetchiki)





router.post('/createSchetchiki_by_data', deviceController.createSchetchiki1)

module.exports = router