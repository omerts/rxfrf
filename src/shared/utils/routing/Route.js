import React, {Component} from 'react'

function findMatcher (matchers, route) {
  return matchers.find((matcher) => matcher.match(route))
}

class Route extends Component {
  constructor (props, context) {
    super(props, context)

    this.matcher = findMatcher(props.matchers, context.route)
  }

  componentWillReceiveProps (nextProps, nextContext) {
    this.matcher = findMatcher(nextProps.matchers, nextContext.route)
  }

  getChildContext () {
    // If there is a match, cut off a level from the route hierarchy
    if (!this.matcher) {
      return {route: this.context.route}
    }

    const routeParts = this.context.route.split('/')
    const route = '/' + routeParts.slice(2).join('/')

    let excludedRoute = ''

    // No excluded route for default route
    if (this.context.route !== '/') {
      excludedRoute = this.context.excludedRoute + '/' + routeParts[1]
    }

    return {route, excludedRoute}
  }

  render () {
    if (this.matcher) {
      // match might contain params, so we pass them as props
      return React.cloneElement(this.props.component, this.matcher.match(this.context.route))
    }

    return null
  }
}

Route.contextTypes = {
  route: React.PropTypes.string,
  excludedRoute: React.PropTypes.string
}

Route.childContextTypes = {
  route: React.PropTypes.string,
  excludedRoute: React.PropTypes.string
}

export default Route