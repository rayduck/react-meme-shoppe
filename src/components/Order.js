import React from 'react'
import { formatPrice } from '../helpers'
import CSSTransitionGroup from 'react-addons-css-transition-group'

class Order extends React.Component {
  constructor () {
    super()
    this.renderOrder = this.renderOrder.bind(this)
  }
  renderOrder (key) {
    const meme = this.props.memes[key]
    const count = this.props.order[key]
    const removeButton = <button onClick={() => this.props.removeFromOrder(key)}>&times;</button>

    if (!meme || meme.status === 'dead') {
      return <li key={key}>Sorry, {meme ? meme.name : 'Meme'} is dead! {removeButton}</li>
    }
    return (
      <li key={key}>
        <span>
          <CSSTransitionGroup component='span' className='count' transitionName='count' transitionEnterTimeout={250} transitionLeaveTimeout={250}>
            <span key={count}>{count} </span>
          </CSSTransitionGroup>
          | {meme.name} {removeButton}
        </span>
        <span className='price'>{formatPrice(count * meme.price)}</span>
      </li>
    )
  }
  render () {
    const orderIds = Object.keys(this.props.order)
    const total = orderIds.reduce((prevTotal, key) => {
      const meme = this.props.memes[key]
      const count = this.props.order[key]
      const isFresh = meme && meme.status === 'fresh'
      if (isFresh) {
        return prevTotal + (count * meme.price || 0)
      }
      return prevTotal
    }, 0)
    return (
      <div className='order-wrap'>
        <h2>Your Order</h2>
        <CSSTransitionGroup className='order' component='ul' transitionName='order' transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {orderIds.map(this.renderOrder)}
          <li className='total'><strong>Total:</strong>
            {formatPrice(total)}</li>
        </CSSTransitionGroup>

      </div>
    )
  }
}

Order.propTypes = {
  memes: React.PropTypes.object.isRequired,
  order: React.PropTypes.object.isRequired,
  removeFromOrder: React.PropTypes.func.isRequired
}

export default Order
