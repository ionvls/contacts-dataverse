// Import mongoose
const mongoose = require('mongoose')

// Question Schaema for mongoDB
const ContactSchema = mongoose.Schema(
  {
    contact_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true
    },
    fullName: { type: String, require: true },
    email: { type: String, require: true },
    address: { type: String, require: false },
    phone: [{
      type: String
    }]
  },
  {
    timestamps: true,
    collection: 'Contact'
  }
)
// Import model to create model
const ContactModel = mongoose.model('ContactModel', ContactSchema)

module.exports = {
  model: ContactModel,
  create: args => {
    return new Promise(async (resolve, reject) => {
      try {
        let contact = await ContactModel.create(args)
        resolve(contact)
      } catch (err) {
        reject(err)
      }
    })
  },
  getAll: args => {
    return new Promise(async (resolve, reject) => {
      try {
        let contact = await ContactModel.find(args)
        resolve(contact)
      } catch (err) {
        reject(err)
      }
    })
  },
  getOne: args => {
    return new Promise(async (resolve, reject) => {
      try {
        let contact = await ContactModel.findOne(args)
        resolve(contact)
      } catch (err) {
        reject(err)
      }
    })
  },
  getOneById: args => {
    return new Promise(async (resolve, reject) => {
      try {
        let contact = await ContactModel.findById(args)
        resolve(contact)
      } catch (err) {
        reject(err)
      }
    })
  },
  update: args => {
    return new Promise(async (resolve, reject) => {
      try {
        let contact = await ContactModel.updateOne(
          { _id: args.contact_id },
          { $set: args }
        )
        resolve(contact)
      } catch (err) {
        reject(err)
      }
    })
  },
  remove: args => {
    return new Promise(async (resolve, reject) => {
      try {
        let contact = await ContactModel.findOneAndRemove(args)
        resolve(contact)
      } catch (err) {
        reject(err)
      }
    })
  }
}
