import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Button,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';
import axios from 'axios';

import Picture from './picture.js';

export default class HelloWorld extends Component {

  componentDidMount() {
    this.getListOfImages();

    const initial = Orientation.getInitialOrientation();
    Orientation.addOrientationListener((orientation) => {
      this.setState({orientation})
    });
  }

  getListOfImages() {
    axios.get('https://picsum.photos/list')
    .then((res) => {
      var lists = res.data.map((e) => {
        return {
          author: e.author,
          id: e.id,
          height: e.height,
          width: e.width
        }
      }
    );

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }

    var listsShuffled = shuffle(lists);
      this.setState({
        lists: listsShuffled,
        selectedImageNumber: Math.floor(listsShuffled.length / 2)
      });
      console.log(listsShuffled);
      this.getImage(this.state.selectedImageNumber);
    })
  }

  getImage(number, direction) {
    if (direction == "FRONT" && number >= 0 && number < this.state.lists.length - 1) {
      number++
    } else if (direction == "FRONT" && !number) {
      number = 0;
    } else if (direction == "FRONT" && number == this.state.lists.length - 1){
      number = 0;
    } else if (direction == "BACK" && number > 0) {
      number--;
    } else if (direction == "BACK" && number == "Null") {
      number = this.state.lists.length - 1;
    } else if (direction == "BACK" && !number) {
      number = 0;
    }
    if (this.state.lists) {
      var selectedImage = this.state.lists[number];
      this.setState({
        selectedImage,
        selectedImageNumber: number
      });
    }
  }

  static navigationOptions = {
    title: 'Tap the image to open it',
    headerStyle: {
      backgroundColor: '#cd6133'
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign: "center"
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      lists: false,
      selectedImage: false,
      selectedImageNumber: false,
      blur: false,
      gray: false,
      fullscreen: false,
      orientation: "PORTRAIT"
    }
    // var width = Dimensions.get('window').width;
    // var height = Dimensions.get('window').height;
    // console.log("heightwidth"+width+"///"+height);
    const { navigate } = this.props.navigation;
  }

  render() {
    const iconsUri = require("../assets/icons/keyboard-right-arrow-button.png");

    return(
      <LinearGradient
        colors={['#FBB03B','#D4145A']}
        style={{flex:1}} >

        <View style={this.state.orientation == "PORTRAIT" ? portrait.container : landscape.container}>

          <View style={this.state.orientation == "PORTRAIT" ? portrait.buttons : landscape.buttons}>
            <View style={{marginRight:10}} >
                <Button
                  color={!this.state.gray ? "grey" : "green"}
                  title={!this.state.gray ? "Gray" : "Colorful"}
                  onPress={() => {
                    this.setState({gray: !this.state.gray});
                  }}
                  style={this.state.orientation == "PORTRAIT" ? portrait.button : landscape.button}>
                </Button>
            </View>
            <View >
                <Button
                  title={!this.state.blur ? "Blur" : "Sharp"}
                  onPress={() => this.setState({blur: !this.state.blur})}
                  style={this.state.orientation == "PORTRAIT" ? portrait.button : landscape.button}>
                </Button>
            </View>
        </View>

        <View style={this.state.orientation == "PORTRAIT" ? portrait.imgBlock : landscape.imgBlock}>
          <TouchableOpacity onPress={() => {
            console.log(this.state.orientation);
            this.getImage(this.state.selectedImageNumber ? this.state.selectedImageNumber : "Null", "BACK");
          }}>
            <Image
              style={{height: 50, width: 50, transform: [{ rotate: '180deg'}]}}
              source={iconsUri} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate("Picture", {
              url: this.state.selectedImage.id,
              grey: this.state.gray,
              blur: this.state.blur,
              fullscreen: true,
            })
          }}>
            <Picture
              url={this.state.selectedImage.id}
              grey={this.state.gray}
              blur={this.state.blur}
              fullscreen={this.state.fullscreen}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            this.getImage(this.state.selectedImageNumber, "FRONT");
            console.log(this.state.orientation);
          }}>
            <Image
              style={{height: 50, width: 50}}
              source={iconsUri} />
          </TouchableOpacity>
        </View>

        { this.state.selectedImage &&
          (
            <Text style={this.state.orientation == "PORTRAIT" ? portrait.text : landscape.text}>
              Author: {"\t"}{this.state.selectedImage.author}{"\n"}
               {"\n"}
              Height: {"\t"}{this.state.selectedImage.height} px.{"\n"}
              Width:  {"\t"}{this.state.selectedImage.width} px.
            </Text>
          )
        }

        </View>
      </LinearGradient>
    );
  }
};

const portrait = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  imgBlock: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center'
  },
  picture: {
    height:200,
    width:200,
    alignSelf:'center',
    borderRadius:10,
    marginHorizontal:15
  },
  text: {
    color:'white',
    fontSize:20,
    alignSelf:'center',
    textAlign: 'center',
    marginTop:30
  },
  textInput: {
    color:'white',
    fontSize:20,
    alignSelf:'center',
    marginTop:30,
    borderBottomColor: 'white'
  }
});
const landscape = StyleSheet.create({
  imgBlock: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex:1,
    flexDirection:"row",
    alignItems:'center',
    justifyContent:'center'
  },
  buttons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  button: {
    marginHorizontal: 15
  },
  picture: {
    height:200,
    width:200,
    alignSelf:'center',
    borderRadius:10,
    marginHorizontal:15
  },
  text: {
    color:'white',
    fontSize:20,
    alignSelf:'center',
    textAlign: 'center',
    marginTop:30
  },
  textInput: {
    color:'white',
    fontSize:20,
    alignSelf:'center',
    marginTop:30,
    borderBottomColor: 'white'
  }
});
