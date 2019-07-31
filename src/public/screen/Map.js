import React,{Component} from 'react'
import {View, AsyncStorage, StyleSheet}from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation';
import user from '../User'
import { Button, Text, Footer, FooterTab, Icon, Fab } from 'native-base';
import firebase from 'firebase';


export default class maps extends Component {
    constructor(props){
        super(props);
        this.state={
            name:'bambang',
            longitude:'',
            latitude:'',
            mydata:[],
        },
        this.getLocation()
    }

    getLocation = async()=>{
        await Geolocation.getCurrentPosition(
           (position) => {
             this.setState({
               latitude: position.coords.latitude,
               longitude: position.coords.longitude,
               error: null,
             });
           },
           (error) => this.setState({ error: error.message }),
           { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
         );
       }

    logout = async() =>{
        await AsyncStorage.removeItem('uid');
        this.props.navigation.navigate('Login')
    }

    handleListChat = ()=>{
        this.props.navigation.navigate('ListChat')
    }
    handleListMap1 = ()=>{
        this.props.navigation.navigate('Map1')
    }

    async componentWillMount(){
        this.setState({
            myuid: await AsyncStorage.getItem('uid'),
            
        })
        await firebase.database().ref().child('users').child(this.state.myuid).on('value', (data)=>{
          let value = data.val()
              this.setState({
                  mydata:value
              })
              
          })
      }


    render(){
        // console.warn(this.state.mydata.email)
        // console.warn(this.state.latitude)
        if (this.state.latitude) {
            return(
                <View style={styles.container}>
                    <View style={styles.container}>
                        <MapView
                            style={styles.map}
                            region={{
                                "latitude": this.state.latitude,
                                "longitude": this.state.longitude,
                                latitudeDelta: 0.015,
                                longitudeDelta: 0.0121,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: this.state.latitude,
                                    longitude: this.state.longitude,
                                }}
                                title={this.state.name}
                                description="in here"
                            />
                        </MapView>
                        
                        <View style={{position:'absolute', right:0, bottom:70}}>
                            <Fab
                                onPress={this.logout}
                                style={{backgroundColor:'#347ed9'}}
                                position="bottomRight"
                                bordered
                                >
                                <Icon name="contacts" style={styles.icon}/>
                            </Fab>
                        </View>
                        <Footer style={{backgroundColor:'#347ed9'}}>
                            <FooterTab style={{backgroundColor:'#347ed9'}}>
                                <Button vertical active style={{backgroundColor:'#2d6ebd'}}>
                                    <Icon name="navigate" />
                                    <Text>Maps</Text>
                                </Button>
                                <Button vertical onPress={this.handleListChat}>
                                    <Icon name="chatbubbles" />
                                    <Text>Chat</Text>
                                </Button>
                                <Button vertical onPress={this.handleListMap1}>
                                    <Icon active name="person" />
                                    <Text>Profile</Text>
                                </Button>
                            </FooterTab>
                        </Footer>
                    </View>
                </View>
            )    
        }
        return(
            <View style={styles.container}>
                <View style={styles.container}>
                    <MapView
                        style={styles.map}
                        region={{
                            "latitude": -7.7613167,
                            "longitude": 110.3589596,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}>
                    </MapView>
                </View>
                <View style={{position:"absolute", top:50, left:0}}>
                    <Button success onPress={this.logout}>
                        <Text>Logout</Text>
                    </Button>
                </View>
           </View>
       )    
    }
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex:1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    view:{
        position:"absolute"
    }
   });