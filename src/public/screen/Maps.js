import React,{Component} from 'react'
import {View, TouchableOpacity, StyleSheet,Animated,Dimensions,Image,Modal,AsyncStorage, ActivityIndicator}from 'react-native';
import MapView, {Marker} from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation';
import firebase from 'firebase';
import user from '../User';
import { Button, Footer, FooterTab, Text, Icon } from 'native-base';


const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class maps extends Component {
    constructor(props){
        super(props);
        this.state={
            longitude:'',
            latitude:'',
            data:[],
            modalVisible: false,
        },
        this.getLocation();
        this.updateStatusOffline();
    }

    updateStatusOffline= async() =>{
        await firebase.database().ref('users/'+ user.uid)
            .onDisconnect().update({
            status:'offline'
        })
    }

    getLocation = async()=>{
        await Geolocation.getCurrentPosition(
           (position) => {
             this.setState({
               latitude  : position.coords.latitude,
               longitude : position.coords.longitude,
               error: null,
             });
           },
           (error) => this.setState({ error: error.message }),
           { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
         );
       }

    updateLocation = async() =>{
        if (this.state.latitude) {
            await firebase.database().ref('users/'+ user.uid).update({
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                status:'online'
            })
        }
    }

	setModalVisible(visible, value) {
        if (value == undefined) {
            this.setState({
                modalVisible: visible,
            })
        }else{
            this.setState({
                modalVisible: visible,
                nama: value.username,
                email: value.email,
                status: value.status,
                id: value.uid,
                profile: value.profile,
            })
        }
        
 	}

    async componentWillMount() {
        this.index = 0;
        this.animation = new Animated.Value(0);
        this.setState({
            myuid: await AsyncStorage.getItem('uid'),
            
        })
    }

    componentDidMount(){
        firebase.database().ref('users').on('value', (data) =>{
            let values = data.val()
            if (values) {
                const messageList = Object.keys(values).map(key =>({
                  ...values[key],
                  uid: key
                }));
                this.setState({
                  data: messageList
                })
              }
        })

        this.animation.addListener(({ value }) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
            if (index >= this.state.data.length) {
              index = this.state.data.length - 1;
            }
            if (index <= 0) {
              index = 0;
            }
      
            clearTimeout(this.regionTimeout);
            this.regionTimeout = setTimeout(() => {
              if (this.index !== index) {
                this.index = index;
                const coordinate = this.state.data[index];
                this.map.animateToRegion(
                  {
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                    latitudeDelta: 0.02864195044303443,
                    longitudeDelta: 0.020142817690068,
                  },
                  350
                );
              }
            }, 10);
          });
    }

    exit = async() =>{
        await AsyncStorage.removeItem('id_user');
        this.props.navigation.navigate('SignIn')
    }

    moveToChat = () =>{
        this.setState({
            modalVisible: false
        })
        let data = {
            username: this.state.nama,
            uid: this.state.id,
            profile:this.state.profile
        }
        this.props.navigation.navigate('Chat', data)
    }
    moveToProfile = ()=>{
        this.setState({
            modalVisible:false
        })
        this.props.navigation.navigate('FriendProfile',{uid:this.state.id})
    }

    handleListChat = ()=>{
        this.props.navigation.navigate('ListChat')
    }
    handleListProfile = ()=>{
        this.props.navigation.navigate('Profile')
    }

    render(){
        if (this.state.latitude && this.state.longitude) {
            this.updateLocation()  
            return(
                
                <View style={styles.container}>
                 <View style={styles.container}>
                   <MapView
                        ref={map => this.map = map}
                        style={styles.map}
                        region={{
                            "latitude": this.state.latitude,
                            "longitude": this.state.longitude,
                            latitudeDelta: 0.02864195044303443,
                            longitudeDelta: 0.020142817690068,
                        }}
                    >
                        {this.state.data.map((item)=>{
                            if(item.longitude == '' || item.uid == user.id){
                                
                            }else{
                                return (
                                    <Marker
                                        coordinate={{
                                            latitude: item.latitude,
                                            longitude: item.longitude,
                                        }}
                                        title={item.username}
                                        description="in here"
                                    />
                                )
                            } 
                        })}
                        
                    </MapView>
                    
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
                            <Button vertical onPress={this.handleListProfile}>
                                <Icon active name="person" />
                                <Text>Profile</Text>
                            </Button>
                        </FooterTab>
                    </Footer>


                    {/* Modal when card on click */}
                    <View>
                        <Modal
                            transparent={true}
                            animationType="fade"
                            visible={this.state.modalVisible}
                            onPress={() => this.setModalVisible(false)}
                        >
                            <View style={{
                                flex:1,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                }}>
                                <TouchableOpacity onPress={() => this.setModalVisible(false)}
                                style={styles.modelstyle}
                                >
                                    <View style={styles.imageModal}>
                                        <View style={{flex:2}}>
                                            <View style={{backgroundColor:"#539ffc",height:146}}></View>
                                            <Image
                                                source={{uri: (this.state.profile) }}
                                                style={styles.images}
                                            />
                                            <Text style={{fontSize: 15, textAlign:'center', marginTop:10}}>{this.state.nama}</Text>
                                            { this.state.status=='online' ? <Text style={styles.textModal}>Online</Text> : <Text style={styles.textModalOffline}>Offline</Text>}
                                            
                                            <Text style={{fontSize: 15, textAlign:'center'}}></Text>
                                            <View style={{flexDirection:'row', width:'100%', paddingLeft:20, paddingRight:20}}>
                                                <Button success style={{flex:1,marginRight:5, height:40, width:70}} onPress={this.moveToChat}>
                                                    <Text style={{textAlign:'center',width:'100%'}}>Chat</Text>
                                                </Button>
                                                <Button info style={{flex:1, marginLeft:5, height:40,}} onPress={this.moveToProfile}>
                                                    <Text style={{textAlign:'center', width:'100%'}}>Profile</Text>
                                                </Button>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                    <Animated.ScrollView
                        horizontal
                        scrollEventThrottle={1}
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CARD_WIDTH}
                        onScroll={Animated.event(
                            [ {
                                nativeEvent: {
                                contentOffset: {
                                    x: this.animation,
                                },
                                },
                            }, ],
                            { useNativeDriver: true }
                        )}
                        style={styles.scrollView}
                        contentContainerStyle={styles.endPadding}
                        >
                        {this.state.data.map((marker, index) => {
                            if(marker.uid !== user.uid){
                                return(
                                    <TouchableOpacity onPress={() => this.setModalVisible(true, marker)}>
                                        <View style={styles.card} key={index}>
                                        <Image
                                            source={{uri: (marker.profile) }}
                                            style={styles.cardImage}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.textContent}>
                                            <Text numberOfLines={1} style={styles.cardtitle}>{marker.username}</Text>
                                            <Text numberOfLines={1} style={styles.cardDescription}>
                                            {marker.email}
                                            </Text>
                                        </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                        })}
                    </Animated.ScrollView>
                </View>
                </View>
                
            )    
        }
        return(
        <View>
            <View style={{height:'92%'}}>
                <View style={[styles.containerLoading, styles.horizontalLoading]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
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
                    <Button vertical onPress={this.handleListProfile}>
                        <Icon active name="person" />
                        <Text>Profile</Text>
                    </Button>
                </FooterTab>
            </Footer>
        </View>

       )    
    }
}

const styles = StyleSheet.create({
    // Loading
    containerLoading: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontalLoading: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },

    // Screen
    modelstyle:{
        position:'absolute',
        top:0,
        bottom:0,
        right:0,
        left:0,
        justifyContent: 'center', 
		alignItems: 'center'
    },
    imageModal:{
        width: "80%",
        minHeight: 280,
        textAlign: "center",
        alignSelf: "center",
        position: "relative",
        backgroundColor: "#FFF9EC",
        borderRadius: 5,
        elevation: 3
    },
    images:{
        marginTop:40,
        marginBottom: 25,
        height:100,
        width:100,
        borderRadius:50,
        alignSelf:'center',
        position: 'absolute',
        borderWidth: 4,
        borderColor: "white",

    },
    textModal:{
        textAlign:'center',
        color:'limegreen',
        fontWeight:"800",
        marginTop:4,
    },
    textModalOffline:{
        textAlign:'center',
        color:'crimson',
        fontWeight:"800",
        marginTop:4,
    },
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
    },
    scrollView: {
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    endPadding: {
        paddingRight: width - CARD_WIDTH,
    },
    card: {
        padding: 10,
        elevation: 2,
        backgroundColor: "#FFFFFF",
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
        borderRadius:5,
    },
    cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    textContent: {
        flex: 1,
    },
    cardtitle: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(130,4,150, 0.9)",
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
    },
    fab: {
        position: 'absolute', 
        width: 58, 
        height: 57, 
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center', 
        left: 10, 
        top: 20, 
        backgroundColor: '#FFFCFC', 
        borderRadius: 50, 
        elevation: 3
    },
    fabRight: {
        position: 'absolute', 
        width: 58, 
        height: 57, 
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center', 
        right: 10, 
        top: 20, 
        backgroundColor: '#FFFCFC', 
        borderRadius: 50, 
        elevation: 3
    }
   });