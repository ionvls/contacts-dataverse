const validator = require("email-validator");
// IMPORT MODELS
const Contact = require('../models/Contact.model')

// Contact model
module.exports = {
  getAll: async (req, res) => {
    // return all contacts
    let allContacts
    allContacts = await Contact.getAll()
      .then(data => data)

    if (allContacts === null) {
      res.json({
        status: false,
        error: 'Failed to fetch'
      })
    } else {
      res.json({
        status: true,
        data: {
          allContacts
        }
      })
    }
  },

  getById: async (req, res) => {
    // get contact by id
    const contact_id = req.params.id
    let contact

    contact = await Contact.getOneById(contact_id)
      .then(data => data)
    
      if (contact === null) {
      res.json({
        status: false,
        error: `Failed to find contact`
      })
      return
    }
    res.json({
      status: true,
      data: {
        contact
      }
    })
  },

  createContact: async (req, res) => {
    // check if mail is valid
    let valid_email = validator.validate(req.body.email)
    if (!valid_email) {
      res.json({
        status: false,
        error: 'Email not valid'
      })
      return
    }
    let result = await Contact.create({
      fullName: req.body.fullName,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone
      })
      .then(data => data)
      .catch(err => err)
    if (result === null) {
      res.json({
        status: false,
        error: 'Failed to create'
      })
    } else {
      res.json({
        status: true,
        data: {
          result
        }
      })
    }
  },

  editContact: async (req, res) => {
    // Find contact by id
    const contact_id = req.body.contact_id
    let contact
    contact = await Contact.getOneById(contact_id)
      .then(data => data)
      .catch(err => err)
      
    // check if mail is valid  
    let valid_email = validator.validate(req.body.email)
    
    if (contact === null || !valid_email) {
      res.json({
        status: false,
        error: 'Cannot find contact or invalid email'
      })
    } else {
      await Contact.update({
        fullName: req.body.fullName,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        contact_id: contact_id
      }).then(data => data)
      res.json({
        status: true,
        message: 'sucess'
      })
    }
  },
  deleteContact: async (req, res) => {
    // Find contact by id and delete it
    const contact_id = req.body.contact_id
    let contact
    contact = await Contact.getOneById(contact_id)
      .then(data => data)
      .catch(err => err)

    if (contact === null) {
      res.json({
        status: false,
        error: 'cannot find Contact'
      })
    } else {
      await Contact.remove({
        contact_id: contact.contact_id
      })
      .then(data => data)
      res.json({
        status: true,
        message: 'sucess'
      })
    }
  }
}
