import React, { Component } from "react";
import {
   TouchableOpacity,
   View,
   Image
} from "react-native";

class Menu extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <View style={{
            paddingTop: 50,
            paddingLeft: 10,
            backgroundColor: "black"
         }
         }>
            <TouchableOpacity
               onPress={() => { this.props.toggleAction() }}
            >
               <Image source={require("../assets/icons/menu.png")} />
            </TouchableOpacity>
         </View >

      );
   }
}
export default Menu;