import LoginScreen from "../screens/Login"

export default {
  // root: {
    stack: {
      children: [
        {
          component: {
            name: LoginScreen.componentName,
          },
        },
      ],
      options: {
        topBar: {
          visible: false,
        },
        animations: {
          showOverlay: { 
            alpha: { 
              from: 0,
              to: 1,
              duration: 400,
              startDelay: 0,
              interpolation: `accelerate` 
            },
            x: { 
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
    },
  // },
}