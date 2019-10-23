import React from 'react'
import { compose, withState, withHandlers, lifecycle } from 'recompose'
import instance from '../libs/axios'
import swal from 'sweetalert2'
import { formatPhoneNumberIntl } from 'react-phone-number-input'
import { Container } from '../styles/Global'
import { Table } from 'react-bootstrap';

// Renders contacts table 
const Contacts = props => (
  <Container className="container">
    <h1>Contacts</h1>
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>E-mail</th>
            <th>Address</th>
            <th>Phone Numbers</th>
          </tr>
        </thead>
        <tbody>
          {
            props.contacts.map((c, index) => (
              <tr key={c._id}>
                <td>{c.fullName}</td>
                <td>{c.email}</td>
                <td>{c.address}</td>
                <td><ul style={{listStyleType:'none'}}>{
                  c.phone.map ((phone,index) =>(
                    <li>{formatPhoneNumberIntl(phone)}</li>
                  ))
                  }</ul></td>
                <td style={{float: 'right'}}>
                  <button
                    style={{padding: '.5rem .25rem'}}
                    className="btn btn-success pull-left point"
                    onClick={e => props.onEdit(e,c)}
                  >
                    <i className="fa fa-pencil" />
                  </button>
                  <button
                    className="btn btn-danger pull-right point"
                    onClick={e => props.onDelete(e,c)}
                  >
                    <i className="fa fa-trash" />
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
    <button
      className="btn btn-info point"
      onClick={e => props.history.push('/contact')}
    >
      + Add Contact
    </button>
  </Container>
  
)

const ContactsCompose = compose(
  withState('contacts', 'setContacts', []),
  
  lifecycle({
    async componentDidMount() {
      
      // get contacts
      let contacts = await instance.get(`/contacts`).then(resp => {
        if (resp.data.status) {
          return resp.data.data.allContacts
        }
        else return false
      })

      if(contacts){
        this.props.setContacts(contacts.sort())
      }   
    }
  }),
  withHandlers({
    onEdit: props => async (e,contact) => {
      e.preventDefault()
      // send to contact edit page
      if (contact){
        props.history.push(`/contact/${contact._id}`)
      }
    },
    // Delete contact upon confirmation
    onDelete: props => async (e,contact) => {
      e.preventDefault()
      if (contact !== undefined) {
         swal({
           title: 'Delete',
           text: `Are you sure to delete contact '${contact.fullName}'`,
           showCancelButton: true,
           reverseButtons: true,
           confirmButtonText: 'Confirm',
           confirmButtonColor: '#1BB7BF',
           customClass: 'Button',
           showLoaderOnConfirm: true,
           preConfirm: () => {
             return new Promise((resolve, reject) => {
               instance.post(`/contacts/del`, {
                 contact_id: contact._id,
               }).then(data => {
                 resolve(data.data)
               })
             })
           }
         }).then(async (data) => {
           if (data.status) {
              props.setContacts([])
              swal({
               title: 'Success',
               text: `Contact Deleted`,
               type: 'success',
               confirmButtonText: 'OK',
               confirmButtonColor: '#1BB7BF'
              })
              let contacts = await instance.get(`/contacts`)
               .then(resp => resp.data.data.allContacts)
              props.setContacts(contacts.sort())

           } else {
             swal({
               title: 'Failed',
               text: `Failed to delete contact, please try again.`,
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
     },

  })
)(Contacts)

export default ContactsCompose
