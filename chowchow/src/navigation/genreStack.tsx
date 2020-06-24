import GenreModal from '../screens/GenreModal'
import { Navigation, Layout } from 'react-native-navigation'

const genreStack = (genres: any[], onChange?: (genreId) => void) => {
  return { 
    stack: 
    { 
      children: [
        {
          component: {
            name: GenreModal.componentName,
            passProps: {
              genres,
              onChange,
            },
            options: {
              topBar: {
                title: {
                  text: `Genres`
                },
                visible: false
              },
              layout: {
                backgroundColor: `black`,
              },
              animations: {
                showModal: { 
                  alpha: { 
                    from: 0,
                    to: 1,
                    duration: 400,
                    startDelay: 0,
                    interpolation: `accelerate` 
                  } 
                },
                dismissModal: { 
                  alpha: { 
                    from: 1,
                    to: 0,
                    duration: 400,
                    startDelay: 0,
                    interpolation: `accelerate` 
                  } 
                }
              }
            },
            modalPresentationStyle: `overCurrentContext`
          }
        }
      ] 
    } 
  }
}

export const showGenreModal = (componentId, genres, onChange?) => {
  const stack: Layout = genreStack(genres, onChange) as Layout

  Navigation.showModal(stack as Layout)
}

