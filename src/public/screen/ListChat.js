import React from 'react';
import { View, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import { Footer, FooterTab, Content, List, ListItem, Left, Body, Icon, Thumbnail, Text, Button,  } from 'native-base';
import User from '../User'

import firebase from 'firebase';
import { SafeAreaView } from 'react-navigation';


export default class ListChat extends React.Component{
    static navigationOptions = {
        title : 'Chat List'
    }
    state = {
        users:[]
    }

    handleListMap = ()=>{
        this.props.navigation.navigate('Maps')
    }
    handleListProfile = ()=>{
        this.props.navigation.navigate('Profile')
    }

    componentWillMount(){
      let dbRef = firebase.database().ref('users');
        dbRef.on('child_added', (val)=>{
            let person = val.val();
            person.uid = val.key;
            if(person.uid==User.uid){
                User.email=person.email
            }else{
                this.setState((prevState)=>{
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        })
    }

    renderRow = ({item}) => {
        return(
            <Content>
                <List>
                    <ListItem avatar >
                        <Left>
                            <TouchableOpacity onPress={ ()=> this.props.navigation.navigate('Chat', item)}>
                                <Thumbnail source={{ uri: (item.profile) }} style={{width:35, height:35}}/>
                            </TouchableOpacity> 
                        </Left>
                        <Body>
                            <TouchableOpacity onPress={ ()=> this.props.navigation.navigate('Chat', item)}>
                                <Text style={{fontSize:22}}>{item.username}</Text>
                            </TouchableOpacity> 
                        </Body>
                    </ListItem>                       
                </List>
            </Content>  
        )
    }

    render(){
        return(
            <View>
                <View style={{height:"100%"}}>
                    <SafeAreaView>
                        <FlatList
                            data={this.state.users}
                            renderItem={this.renderRow}
                            keyExtractor={(item)=>item.uid}
                        />
                    </SafeAreaView>
                </View>
                <Footer style={{backgroundColor:'#347ed9', position:"absolute", bottom:0}}>
                    <FooterTab style={{backgroundColor:'#347ed9'}}>
                        <Button vertical onPress={this.handleListMap}>
                            <Icon name="navigate" />
                            <Text>Maps</Text>
                        </Button>
                        <Button vertical style={{backgroundColor:'#2d6ebd'}}>
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