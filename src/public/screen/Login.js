import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert, AsyncStorage, ActivityIndicator} from 'react-native';
import { Container, Content, Form, Item, Input,  Button, Text } from 'native-base';
import Fire from '../../../Fire'
import firebase from 'firebase';
import User from '../User'



export default class Login extends Component {
  
  state = { 
    uid:'', 
    email: '', 
    password:'',
    is_loading:false, 
  }

  handleChange = key=> val=>{
    this.setState({[key]:val})
  }

  submitForm = async ()=>{
    this.setState({is_loading:true})
    await firebase.auth()
    .signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(this.successLogin, this.errorLogin)
    .catch(function(error){
      Alert.alert('Error',error.message)
    })
    
  }

  errorLogin = async (error)=>{
    await this.setState({
      is_loading:false
    })
    Alert.alert('Error',error.message)
  }

  successLogin = async (data) => {
    let uid = data.user.uid
    AsyncStorage.setItem('uid',uid)
    User.uid = uid
    await this.setState({ is_loading:false })

    this.props.navigation.navigate('Maps')
}




  render() {
    return (
      <Container style={styles.container}>  
        <Content >
        <View style={{ flex:1, alignItems:"center", paddingTop:40}}>
          <Image source={require('../../assets/chat.png')} style={styles.image} />
        </View>
          <Form style={{marginTop:50}}>
            <Item>
              <Input 
                placeholder="Email"
                value={this.state.email}
                onChangeText={this.handleChange('email')} 
              />
            </Item> 
            <Item>
              <Input 
                placeholder="Password" 
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={this.handleChange('password')} 
              />
            </Item>
            <View style={styles.button}>
              <Button block onPress={this.submitForm} style={{backgroundColor:'#347ed9'}}>
              {this.state.is_loading ? <ActivityIndicator size="large" color="#ffffff"/> : <Text>Login</Text>}
              </Button>
            </View>
          </Form>
          <View style={styles.registration}>
            <Text style={{textAlign:"center"}}>
              Don't have an account yet? 
            </Text>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Registration')}>
              <Text style={{fontWeight:"bold"}}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    paddingHorizontal:10,
    
  },
  image:{
    marginHorizontal:20,
    height:150,
    width:200,
    // marginTop:'5%'
  },
  button:{
    marginTop:'5%'
  },
  registration:{
    marginTop:15,
    paddingBottom: 40,
    flexDirection:'row',
    alignSelf:'center'
  }

});

// <Image source={require('../../assets/live_chat.png')} style={styles.image} />
