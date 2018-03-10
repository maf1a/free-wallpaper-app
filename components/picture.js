import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  Button,
  Platform,
  Alert
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob'

export default class Picture extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isDownloading:false,
      wasDownloaded:false
    }
  }

  static navigationOptions = {
    title: 'Select the image',
    headerStyle: {
      backgroundColor: '#FBB03B',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign: "center"
    },
  };

  render() {
    if (this.props.navigation) {
      var {blur, grey, url, fullscreen} = this.props.navigation.state.params;
    } else {
      var {blur, grey, url, fullscreen} = this.props;
    }

    var greynify = grey ? '/g' : '';
    var blurify = blur ? '&blur' : '';
    var uri = `https://picsum.photos${greynify}/800/800/?image=${url+blurify}`;

    return (
      <View style={!fullscreen ? style.picture : style.fullscreen}>
        <Image
          style={!fullscreen ? style.picture : style.fullscreen}
          source={{uri}} />
        {
          fullscreen && (
            <View
              style={{
                marginTop:-30,
                position: "absolute",
                bottom:50,
                alignSelf: 'center'
              }}>
              <Button
                disabled={
                  !this.state.isDownloading && !this.state.wasDownloaded ? false : true
                }
                title={
                  !this.state.isDownloading && !this.state.wasDownloaded
                  ? "Download this picture"
                  : this.state.isDownloading
                  ? "Downloading..."
                  : this.state.wasDownloaded
                  ? "Downloaded successfully!" : ""
                }
                onPress={() => {
                  this.setState({
                    isDownloading:true
                  });

                  const downloads = RNFetchBlob.fs.dirs.DownloadDir;
                  RNFetchBlob.config({
                    fileCache : true,
                    addAndroidDownloads : {
                      useDownloadManager : true,
                      notification : true,
                      title: "Image '"+url+".jpeg' downloaded. Tap to open",
                      path:  downloads+"/"+url+'.jpeg',
                    }
                  })
                  .fetch('GET', uri)
                  .then(() => {
                    this.setState({
                      isDownloading:false,
                      wasDownloaded:true
                    });
                    // setTimeout(() => {
                    //   this.props.navigation.goBack();
                    // }, 1000);
                  });
                }}
                ></Button>
            </View>
          )
        }
      </View>
    );
  }
}

const style = StyleSheet.create({
  picture: {
    height:200,
    width:200,
    alignSelf:'center',
    borderRadius:10,
    marginHorizontal:15
  },
  fullscreen: {
    flex:1
  },
});
