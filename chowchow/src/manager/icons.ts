import Icon from 'react-native-vector-icons/Ionicons'
import colors from '../theme/colors'

const icons: { [s: string]: any } = {}

interface IIconKey {
  name: string;
  size: number;
  color: string;
}

const iconsToLoad: IIconKey[] = [
  {
    name: `ios-download`,
    size: 30,
    color: colors.Primary,
  },
  {
    name: `ios-person-add`,
    size: 30,
    color: `white`,
  },
  {
    name: `ios-menu`,
    size: 30,
    color: `white`,
  },
  {
    name: `ios-close`,
    size: 35,
    color: `white`,
  },
  {
    name: `ios-menu`,
    size: 35,
    color: `white`,
  },
  {
    name: `ios-funnel`,
    size: 30,
    color: `white`,
  },
]

/**
 * Load all the icons we need as images
 */
export async function init(): Promise<void> {
  const values = await Promise.all(iconsToLoad.map((icon: IIconKey) => {
    const { name, size, color, } = icon

    return Icon.getImageSource(name, size, color)
  }))

  iconsToLoad.forEach((icon: IIconKey, index) => {
    icons[icon.name] = values[index]
  })
}

/**
 * Gets an icon image
 * @param key
 */
export function getIcon(key: string): string {
  return icons[key]
}
