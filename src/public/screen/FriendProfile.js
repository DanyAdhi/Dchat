import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { Footer, FooterTab, Icon, Text, Button, Header, Left, Right, Body, Title, Fab } from 'native-base';
import firebase from 'firebase';

export default class FriendProfile extends Component {

  constructor(props){
    super(props);
    this.state = {
        uid: this.props.navigation.state.params.uid,
        data: []
    }
  }

    static navigationOptions = {
        title : 'Profile'
    }

    componentDidMount = async() => {
      await firebase.database().ref().child('users').child(this.state.uid).on('value', data =>{
          let value = data.val()
          this.setState({
              data:value,
          })
      })        
    }

    handleListChat = ()=>{
        this.props.navigation.navigate('ListChat')
    }
    handleListMaps = ()=>{
        this.props.navigation.navigate('Maps')
    }


  render() {
    console.warn(this.props.navigation.state.params.id)

    return (
      <View style={styles.container}>        
        <View style={{height:"100%"}}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{uri: (this.state.data.profile)}}/>
          <View style={styles.body}>
              <View style={styles.bodyContent}>
                <Text style={styles.name}>{this.state.data.username}</Text>
                <Text style={styles.info}>{this.state.data.email}</Text>
              </View>
              <View style={{marginLeft:10}}> 
                <View style={{marginTop:58}}>
                  <Text style={{fontWeight:"bold"}}>Descryption</Text>
                </View>
                <View>
                  <Text>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>
                </View>

                <View style={{marginTop:10}}>
                  <Text style={{fontWeight:"bold"}}>Gender</Text>
                </View>
                <View>
                  <Text>-</Text>
                </View>
                <View style={{marginTop:10}}>
                  <Text style={{fontWeight:"bold"}}>Birthday</Text>
                </View>
                <View>
                  <Text>-</Text>
                </View>
              </View>
          </View>
          
        </View>
        <Footer style={{backgroundColor:'#347ed9', position:"absolute", bottom:0}}>
                <FooterTab style={{backgroundColor:'#347ed9'}}>
                    <Button vertical onPress={this.handleListMaps}>
                        <Icon name="navigate" />
                        <Text>Maps</Text>
                    </Button>
                    <Button vertical  onPress={this.handleListChat}>
                        <Icon name="chatbubbles" />
                        <Text>Chat</Text>
                    </Button>
                    <Button vertical style={{backgroundColor:'#2d6ebd'}}>
                        <Icon active name="person" />
                        <Text>Profile</Text>
                    </Button>
                </FooterTab>
            </Footer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    // backgroundColor: "#00BFFF",
    backgroundColor:"#347ed9",
    height:160,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:15,
    alignSelf:'center',
    position: 'absolute',
    marginTop:70
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:25,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
});