// Contains all the configuration specific to our Server.
// Please note that the DefinePlugin of webpack will inline/replace all the
// respective "process.env.*" variables below with the actual values.
// These config values then become a part of the server bundle.

import fs from 'fs'
import path from 'path'
import appRoot from 'app-root-path'
import ensureEnvVariablesExist from '../../shared/utils/ensureEnvVariablesExist'

const appRootPath = appRoot.toString()

ensureEnvVariablesExist([
  'SERVER_PORT',
  'DISABLE_SSR',
  'CLIENT_BUNDLE_HTTP_PATH',
  'CLIENT_BUNDLE_OUTPUT_PATH',
  'CLIENT_BUNDLE_ASSETS_FILENAME',
  'CLIENT_BUNDLE_CACHE_MAXAGE',
])

export const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10)

export const DISABLE_SSR = process.env.DISABLE_SSR === 'true'

export const CLIENT_BUNDLE_HTTP_PATH = process.env.CLIENT_BUNDLE_HTTP_PATH

export const CLIENT_BUNDLE_OUTPUT_PATH = path.resolve(
  appRootPath, process.env.CLIENT_BUNDLE_OUTPUT_PATH
)

export const CLIENT_BUNDLE_CACHE_MAXAGE = process.env.CLIENT_BUNDLE_CACHE_MAXAGE

const assetsBundleFilePath = path.resolve(
  appRootPath,
  CLIENT_BUNDLE_OUTPUT_PATH,
  process.env.CLIENT_BUNDLE_ASSETS_FILENAME
)
if (!fs.existsSync(assetsBundleFilePath)) {
  throw new Error(
    `We could not find the "${assetsBundleFilePath}" file, which contains a ` +
    'list of the assets of the client bundle.  Please ensure that the client ' +
    'bundle has been built before the server bundle and that the required ' +
    'environment variables are configured (CLIENT_BUNDLE_OUTPUT_PATH & ' +
    'CLIENT_BUNDLE_ASSETS_FILENAME)'
  )
}
export const CLIENT_BUNDLE_ASSETSJSON_FILEPATH = assetsBundleFilePath

export const PUBLIC_DIR_PATH = path.resolve(appRootPath, './public')
