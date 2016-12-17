import React from 'react'
import { formatPrice } from '../helpers'

class Meme extends React.Component {
  render () {
    const { details, index } = this.props
    const isFresh = details.status === 'fresh'
    const buttonText = isFresh ? 'Add To Order' : 'Meme Dead!'
    return (
      <li className='menu-meme'>
        <img src={details.image} alt={details.name} />
        <h3 className='meme-name'>
          {details.name}
          <span className='price'>{formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button className='rightbtn' onClick={() => this.props.addToOrder(index)} disabled={!isFresh}>{buttonText}</button>
      </li>
    )
  }
}

Meme.propTypes = {
  details: React.PropTypes.object.isRequired,
  index: React.PropTypes.string.isRequired,
  addToOrder: React.PropTypes.func.isRequired
}

export default Meme
