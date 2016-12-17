import React from 'react'

class AddMemeForm extends React.Component {
  createMeme (event) {
    event.preventDefault()
    const meme = {
      name: this.name.value,
      price: this.price.value,
      status: this.status.value,
      desc: this.desc.value,
      image: this.image.value
    }
    this.props.addMeme(meme)
    this.memeForm.reset()
  }
  render () {
    return (
      <form ref={(input) => { this.memeForm = input }} className='meme-edit'>
        <input ref={(input) => { this.name = input }} type='text' placeholder='Meme Name' onSubmit={(e) => this.createMeme(e)} />
        <input ref={(input) => { this.price = input }} type='text' placeholder='Meme Price' />
        <select ref={(input) => { this.status = input }}>
          <option value='fresh'>Fresh!</option>
          <option value='dead'>Dead!</option>
        </select>
        <textarea ref={(input) => { this.desc = input }} placeholder='Meme Desc' />
        <input ref={(input) => { this.image = input }} type='text' placeholder='Meme Image' />
        <button type='submit'>Add Item</button>
      </form>
    )
  }
}

AddMemeForm.propTypes = {
  addMeme: React.PropTypes.func.isRequired
}

export default AddMemeForm
