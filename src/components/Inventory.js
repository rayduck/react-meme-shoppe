import React from 'react'
import AddMemeForm from './AddMemeForm'
import base from '../base'

class Inventory extends React.Component {
  constructor () {
    super()
    this.renderInventory = this.renderInventory.bind(this)
    this.renderLogin = this.renderLogin.bind(this)
    this.authenticate = this.authenticate.bind(this)
    this.authHandler = this.authHandler.bind(this)
    this.logout = this.logout.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      uid: null,
      owner: null
    }
  }

  componentDidMount () {
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, { user })
      }
    })
  }

  handleChange (e, key) {
    const meme = this.props.memes[key]
    // take a copy of meme, update with new data
    const updatedMeme = {
      ...meme,
      [e.target.name]: e.target.value
    }
    this.props.updateMeme(key, updatedMeme)
  }

  authenticate (provider) {
    base.authWithOAuthPopup(provider, this.authHandler)
  }

  authHandler (err, authData) {
    if (err) {
      console.error(err)
      return
    }
    // grab store info
    const storeRef = base.database().ref(this.props.storeId)
    // query firebase once for store data
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {}

      // claim owner if no owner
      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        })
      }
      // set local state
      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      })
    })
  }

  logout () {
    base.unauth()
    this.setState({ uid: null })
  }

  renderLogin () {
    return (
      <nav className='login'>
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className='github' onClick={() => this.authenticate('github')}>Log In With Github</button>
        <button className='facebook' onClick={() => this.authenticate('facebook')}>Log In With Facebook</button>
      </nav>
    )
  }
  renderInventory (key) {
    const meme = this.props.memes[key]
    return (
      <div className='meme-edit' key={key}>
        <input type='text' value={meme.name} name='name' placeholder='name' onChange={(e) => this.handleChange(e, key)} />
        <input type='text' value={meme.price} name='price' placeholder='price' onChange={(e) => this.handleChange(e, key)} />
        <select type='text' value={meme.status} name='status' placeholder='status'onChange={(e) => this.handleChange(e, key)} >
          <option value='fresh'>Fresh!</option>
          <option value='dead'>Dead!</option>
        </select>
        <textarea type='text' value={meme.desc} name='desc' placeholder='desc' onChange={(e) => this.handleChange(e, key)} />
        <input type='text' value={meme.image} name='image' placeholder='image' onChange={(e) => this.handleChange(e, key)} />
        <button onClick={() => this.props.removeMeme(key)}>Remove Meme</button>
      </div>
    )
  }
  render () {
    const logout = <button onClick={this.logout}>Log Out!</button>
    // check if no login
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }
    // check if owner
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you aren't the owner of this Shoppe!</p>
          {logout}
        </div>
      )
    }
    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.memes).map(this.renderInventory)}
        <AddMemeForm addMeme={this.props.addMeme} />
        <button onClick={this.props.loadSamples}>Load Sample Memes</button>
      </div>
    )
  }
}

Inventory.propTypes = {
  memes: React.PropTypes.object.isRequired,
  updateMeme: React.PropTypes.func.isRequired,
  removeMeme: React.PropTypes.func.isRequired,
  addMeme: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired
}

export default Inventory
