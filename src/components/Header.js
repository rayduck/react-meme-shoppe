import React from 'react'

const Header = (props) => {
  return (
    <header className='top'>
      <h1>
        MEME SHOPPE
      </h1>
      <h3 className='tagline'><span>{props.tagline}</span></h3>
    </header>
  )
}

Header.propTypes = {
  tagline: React.PropTypes.string
}

export default Header
