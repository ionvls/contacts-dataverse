const router = require('express').Router()

// Import controllers
const ContactController = require('./controllers/Contact.controller')

router.route('/contacts').get(ContactController.getAll)
router.route('/contacts/create').post(ContactController.createContact)
router.route('/contacts/edit').post(ContactController.editContact)
router.route('/contacts/del').post(ContactController.deleteContact)
router.route('/contacts/:id').get(ContactController.getById)

module.exports = router
