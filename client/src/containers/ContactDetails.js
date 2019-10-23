import React from 'react'
import { compose, withState, withHandlers, lifecycle } from 'recompose'
import instance from '../libs/axios'
import swal from 'sweetalert2'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { Container } from '../styles/Global'

// Renders contact details form
const ContactDetails = props => (
  <Container className="container">
    <h1>Contact Details</h1>
    <div>
    <form onSubmit={e => props.onSave(e)}>
        <label>Full Name*</label><br/>
        <input id="name" type="text" required
          onChange={e => props.setName(e.target.value)}
          value={ props.name ? props.name : '' }
        /><br/>
        <label>E-mail*</label><br/>
        <input id="email" type="email" required
          onChange={e => props.setEmail(e.target.value)}
          value={ props.email ? props.email : '' }
        /><br/>
        <label>Address</label><br/>
        <input id="address" type="text"
          onChange={e => props.setAddress(e.target.value)}
          value={ props.address ? props.address : '' }
        /><br/>
        <label>Phone Number*</label><br/>
        {
          props.phone.map((p, index) => (
            <PhoneInput id="phone" type="tel" required
              placeholder="Enter phone number"
              key={index}
              value={ p ? p : '' }
              onChange={value => updatePhone(value,props,index)} />
            
          ))
        }
        <br/>
        <button 
        className="btn btn-success point"
        style={{marginTop: '5pt'}}
        onClick={e => addPhone(e,props)}
        >
        Add phone
        </button>
        <br/>
        <button 
        type="submit"
        className="btn btn-info point"
        style={{marginTop: '5pt'}}
        >
        Save
        </button>
    </form>
    <a 
      href="/" 
      className="btn btn-warning point"
      style={{marginTop: '5pt'}}
      >
      Back
    </a>
    </div>
  </Container>
  
)
// update phone state on change
const updatePhone = (value,props,index) =>{
  let phones= props.phone
  phones[index] = value 
  props.setPhone(phones)
}

// Add new phone field
const addPhone = (e,props) =>{
  let phones= props.phone
  phones.push('')
  props.setPhone(phones)
}

const ContactDetailsCompose = compose(
  withState('contact', 'setContact', ''),
  withState('name', 'setName', ''),
  withState('address', 'setAddress', ''),
  withState('email', 'setEmail', ''),
  withState('phone', 'setPhone', ['']),
  
  lifecycle({
    async componentDidMount() {
      let contact_id = this.props.match.params.id
      
      // get contact details if we are editing an existing contact
      if (contact_id){
        let contact = await instance.get(`/contacts/${contact_id}`).then(resp => {
          if (resp.data.status) {
            return resp.data.data.contact
          }
          else return false
        })
        if(contact){
          this.props.setContact(contact)
          this.props.setName(contact.fullName)
          this.props.setEmail(contact.email)
          this.props.setAddress(contact.address)
          this.props.setPhone(contact.phone)
        }   
      }
    }
  }),
  withHandlers({
    onSave: props => async (e) => {
      e.preventDefault()
      let contact_id = props.match.params.id
      let action = (contact_id) ? 'edit' : 'create'
      let invalidNuber
      props.phone.forEach(p => {
        if (!isValidPhoneNumber(p)) {
          invalidNuber= p
        }
      }) 
      if (invalidNuber){
        swal({
          title: 'Failed',
          text: `Phonenumber ${invalidNuber} is invalid`,
          type: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#1BB7BF'
        })
        return
      }
      swal({
        title: `${action} Contact`,
        text: `Are you sure to ${action} contact`,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Confirm',
        confirmButtonColor: '#1BB7BF',
        customClass: 'Button',
        showLoaderOnConfirm: true,
        focusConfirm: false,
        preConfirm: () => {
          return new Promise((resolve, reject) => {
            instance.post(`/contacts/${action}`, {
              fullName: props.name,
              address: props.address,
              email: props.email,
              phone: props.phone,
              contact_id: contact_id ? contact_id : undefined,
            }).then(data => {
              resolve(data.data)
            })
          })
        }
      }).then(async (data) => {
        if (data.status) {
          swal({
            title: 'Success',
            text: `Contact ${action}ed`,
            type: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#1BB7BF'
          })
          .then(function (){
              props.history.push('/')
            })
        } else {
          swal({
            title: 'Failed',
            text: `Failed to ${action} contact, please try again.`,
            type: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#1BB7BF'
          })
        }
      }, function(dismiss) {
        if (dismiss === 'cancel' || dismiss === 'close') {
        // ignore
        }
      })
    }
  })
)(ContactDetails)

export default ContactDetailsCompose
