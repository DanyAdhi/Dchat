import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  AsyncStorage,
} from 'react-native';
import { Footer, FooterTab, Icon, Text, Button, Header, Left, Right, Body, Title, Fab } from 'native-base';
import firebase from 'firebase';
import user from '../User';

export default class Profile extends Component {

  constructor(props){
    super(props);
    this.state = {
        data: []
    }
  }

    static navigationOptions = {
        title : 'Profile'
    }

    componentDidMount = async() => {
      await firebase.database().ref().child('users').child(user.uid).on('value', data =>{
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

    logout = async() =>{
      await AsyncStorage.removeItem('uid');
      this.props.navigation.navigate('Login')
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{backgroundColor:'#347ed9', height:79}}>
          {/* <Button rounded danger onPress={this.logout} style={{marginTop:5, marginLeft:5}}>
            <Icon name="log-out" style={{color:'#eeeeee'}}/>
          </Button> */}
          <Fab
            onPress={this.logout} 
            style={{ backgroundColor: 'salmon' }}
            position="topRight"
            bordered
            >
            <Icon name="log-out"/>
          </Fab>
        </View>

        
          
          <View style={{height:"87.9%"}}>
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
    backgroundColor:"#347ed9",
    height:81,
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
    marginTop:0
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