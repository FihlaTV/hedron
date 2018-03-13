import React from 'react'
import PropTypes from 'prop-types'
import Input from '../Input'

class ParamvalueForm extends React.Component {
  componentDidMount () {
    const input = document.querySelector('#editing_param')
    input.focus()
    input.select()
  }

  render () {
    const { handleSubmit, onBlur } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <Input name='paramValue' id='editing_param' onBlur={onBlur} />
      </form>
    )
  }
}

ParamvalueForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

export default ParamvalueForm
