import en from './en'

interface IAvailableLocales {
  en: object;
  [key: string]: object;
}

const availableLocales: IAvailableLocales = {
  en,
}

export default availableLocales
