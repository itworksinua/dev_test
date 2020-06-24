import colors from './colors'

const iconSize = 20

const labelData = [
  {
    label: `Overview`,
    line: {
      height: 2,
      color: colors.blue,
    },
    icon: {
      name: `ios-information-circle-outline`,
      size: iconSize,
      color: `#888`,
      selectedColor: colors.blue,
    }
  },
  {
    label: `Screening`,
    line: {
      height: 2,
      color: colors.orange,
    },
    icon: {
      name: `ios-desktop`,
      size: iconSize,
      color: `#888`,
      selectedColor: colors.orange,
    }
  },
  {
    label: `Assets`,
    line: {
      height: 2,
      color: colors.green,
    },
    icon: {
      name: `ios-download`,
      size: iconSize,
      color: `#888`,
      selectedColor: colors.green,
    }
  },
  {
    label: `Seasons`,
    line: {
      height: 2,
      color: colors.blue,
    },
    icon: {
      name: `ios-list`,
      size: iconSize,
      color: `#888`,
      selectedColor: colors.blue,
    }
  },
]

export default labelData