import React from 'react'
import routeParser from 'route-parser'
import urlParser from 'url-parse'
import { Actions, dispatch } from 'shared/actions'
import Route from './Route'

// =============================== Helpers ==============================================
function formatRoute (route, exactMatch) {
  const suffix = exactMatch ? '' : '*children'

  // Check if optional path, add inside the optional so doesn't match all paths
  if (route.endsWith(')')) {
    return route.slice(0, -1) + suffix + ')'
  }

  return route + suffix
}

function getMatchers(routes, exactMatch) {
  if (Array.isArray(routes)) {
    return routes.map((route) => routeParser(formatRoute(route, exactMatch)))
  } else {
    return [routeParser(formatRoute(routes, exactMatch))]
  }
}

function match (routes, component, exactMatch = false) {
  const matchers = getMatchers(routes, exactMatch)

  return <Route matchers={matchers} component={component} />
}


const getRouterParams = (route) => {
  let paramsStartIndex = route.indexOf('?')
  paramsStartIndex = (paramsStartIndex > -1? paramsStartIndex : route.lastIndexOf('/')) + 1

  return route
    .substr(paramsStartIndex)
    .split('&')
    .filter(p => p)
    .reduce((p1, p2) => { 
      const valueKeyPair = p2.split('='); 
      return {...p1, [valueKeyPair[0]]: valueKeyPair[1]}
    }, {})
}


// =============================== Exports ==============================================
export function changeRoute(route) {
  const url = urlParser(route)
  dispatch(Actions.ROUTE_CHANGED, {path: url.pathname, query: url.query, params: getRouterParams(route) })
}

export default match

export function isMatch(haystack, needle, exactMatch = false) {
  let haystackClone = haystack

  // Fix the routes prefix if needed
  if (haystackClone.indexOf('/') !== 0) {
    haystackClone = '/' + haystackClone
  }

  return routeParser(formatRoute(haystackClone, exactMatch)).match(needle)
}

export function getRoute (route, excludedRoute = '') {
  // If starts with /, we treat it as an absolute route
  if (route.indexOf('/') === 0) {
    return route
  }

  return excludedRoute + '/' + route
}