/* global localStorage */
import React from 'react'
import Header from './Header'
import Order from './Order'
import Inventory from './Inventory'
import sampleMemes from '../sample-memes'
import Meme from './Meme'
import base from '../base'

class App extends React.Component {
  constructor () {
    super()
    // binding this to App
    this.addMeme = this.addMeme.bind(this)
    this.updateMeme = this.updateMeme.bind(this)
    this.removeMeme = this.removeMeme.bind(this)
    this.loadSamples = this.loadSamples.bind(this)
    this.addToOrder = this.addToOrder.bind(this)
    this.removeFromOrder = this.removeFromOrder.bind(this)
    this.state = {
      memes: {},
      order: {}
    }
  }
  componentWillMount () {
    // this runs right before <App> is rendered
    this.ref = base.syncState(`${this.props.params.storeId}/memes`, {
      context: this,
      state: 'memes'
    })
    // check if any order in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`)

    if (localStorageRef) {
      // update App order state
      this.setState({
        order: JSON.parse(localStorageRef)
      })
    }
  }
  componentWillUnmount () {
    base.removeBinding(this.ref)
  }
  componentWillUpdate (nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order))
  }
  addMeme (meme) {
    // update state by first making a copy
    const memes = {...this.state.memes}
    // add meme
    const timestamp = Date.now()
    memes[`meme-${timestamp}`] = meme
    // set state
    this.setState({ memes: memes })
  }
  updateMeme (key, updatedMeme) {
    const memes = {...this.state.memes}
    memes[key] = updatedMeme
    this.setState({ memes })
  }
  removeMeme (key) {
    const memes = {...this.state.memes}
    memes[key] = null
    this.setState({ memes })
  }
  loadSamples () {
    this.setState({
      memes: sampleMemes
    })
  }
  addToOrder (key) {
    // take copy of state
    const order = {...this.state.order}
    // update or add new no. meme
    order[key] = order[key] + 1 || 1
    // update state
    this.setState({ order })
  }
  removeFromOrder (key) {
    const order = {...this.state.order}
    delete order[key] // since we're not dealing with firebase here
    this.setState({ order })
  }
  render () {
    return (
      <div className='meme-shoppe'>
        <div className='menu'>
          <Header tagline='Freshest Memes' />
          <ul className='list-of-memes'>
            {Object
              .keys(this.state.memes)
              .map(key => <Meme key={key} index={key} details={this.state.memes[key]} addToOrder={this.addToOrder} />)
            }
          </ul>
        </div>
        <Order memes={this.state.memes} order={this.state.order} params={this.props.params} removeFromOrder={this.removeFromOrder} />
        <Inventory
          addMeme={this.addMeme}
          loadSamples={this.loadSamples}
          memes={this.state.memes}
          updateMeme={this.updateMeme}
          removeMeme={this.removeMeme}
          storeId={this.props.params.storeId} />
      </div>
    )
  }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired
}

export default App
