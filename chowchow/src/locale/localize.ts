import { NativeModules, Platform } from 'react-native'
import Polyglot from "node-polyglot"
import locales from './locales'

const polyglot = new Polyglot({ allowMissing: false, })
const defaultLocale = `en`

/**
 * Set initial lang
 *
 * @export
 */
export function init() {
  const locale = getDeviceLocale()

  set(locale)
}

/**
 * Initialise the translations
 *
 * @export
 * @param {any} store
 */
export function set(locale: string) {
  locale = locale || 'en'
  polyglot.clear()

  // get the main part
  locale = locale.substr(0, 2).toLowerCase()

  extend(defaultLocale)

  if (locale !== defaultLocale) {
    extend(locale)
  }
}

/**
 * Extend
 *
 * @private
 * @param {any} locale
 */
function extend(locale: string) {

  if (typeof locale !== `string`) {
    throw new Error(`locale is not type of string: ${locale}`)
  }

  if (locales[locale] === undefined) {
    console.log(`no translation file for: ${locale}`)
    return
  }

  polyglot.extend(locales[locale])
}

/**
 * translate string
 *
 * @export
 * @param {any} key
 * @param {any} interpolationOptions
 * @returns
 */
export function localize(key: string, options?: number | Polyglot.InterpolationOptions): string {
  if (key === ``) {
    return ``
  }

  return polyglot.t(key, options)
}

/**
 *
 */
function getDeviceLocale(): any {
  if (Platform.OS === `ios`) {
    let locale = NativeModules.SettingsManager.settings.AppleLocale // "fr_FR"
    if (locale === undefined) {
        // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
        locale = NativeModules.SettingsManager.settings.AppleLanguages[0]
        console.log('locale', locale)
        if (locale == undefined) {
              locale = "en" // default language
        }
    }
  } else {
    return  NativeModules.I18nManager.localeIdentifier
  }
}
