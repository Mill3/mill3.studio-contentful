import React from "react"

export const defaultContextValue = {
  options: {
    withIntro: false,
    headerIntroComponent: null,
    transitionTitle: `Mill3`,
    transitionColor: `red`
  },
  set: () => {},
}

const LayoutContext = React.createContext(defaultContextValue);

export default LayoutContext

// const { Provider, Consumer } = React.createContext(defaultContextValue)

// console.log('LayoutContext:', LayoutContext)

// class LayoutContextProvider extends React.Component {
//   constructor() {
//     super()

//     this.setOptions = this.setOptions.bind(this)
//     this.state = {
//       ...defaultContextValue,
//       set: this.setOptions,
//     }
//   }

//   setOptions(newData) {
//     this.setState(state => ({
//       options: {
//         ...state.options,
//         ...newData,
//       },
//     }))
//   }

//   componentDidUpdate(prevProps, prevState) {
//     console.log('should update...?');
//     // if (prevProps !== this.state) {
//     //   this.setOptions(this.props)
//     // }
//   }

//   // componentDidUpdate() {
//   //   console.log(`updated!`, this.props, this.state.options);
//   // }

//   render() {
//     return <Provider value={this.state}>{this.props.children}</Provider>
//   }
// }

// export { Consumer as default, LayoutContextProvider }