import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import { Container, Content, Form, Item, Input, Button, Text } from 'native-base';

import firebase from 'firebase';


export default class Login extends Component {

  state = {
    email:'',
    username:'',
    phone:'',
    password:'',
    profile:'',
    errorMessage: null,
    is_loading:false,
    showAlert: false ,
}

  handleNavigate = () => {
    const { navigation } = this.props;
    navigation.navigate('Login')
  }

  handleChange = key=> val=>{
    this.setState({[key]:val})
  }

  submitForm = async ()=>{
    await this.setState({
      is_loading:true
    })
    let email = this.state.email;
    let password = this.state.password;
    await firebase.auth()
      .createUserWithEmailAndPassword(email,password)
      .then(this.successRegistration, this.errorRegistration)
      
  }

  errorRegistration = async (error)=>{
    await this.setState({
      is_loading:false
    })
    Alert.alert('Error',error.message)
  }

  successRegistration = async (data) => {
    if(this.state.profile=='' || this.state.profile==undefined){ //save register when url image empty
      firebase.database().ref('users/'+data.user.uid).set({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        profile:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpzD-cx0s1md7QU92v0ZDJWCiIKfQ8HWxIiI76o5APPy11ilZ6bA',
        latitude: -6.2120516,
        longitude: 106.8428954,
      });
      await this.setState({
        is_loading:false
      })
      Alert.alert('Success', "User was created successfully.")
      this.props.navigation.navigate('Login')
    }else{ //save register when url image non empty
      firebase.database().ref('users/'+data.user.uid).set({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        profile:this.state.profile,
        latitude: -6.2120516,
        longitude: 106.8428954,
      });
      await this.setState({
        is_loading:false
      })
      Alert.alert('Success', "User was created successfully.")
      this.props.navigation.navigate('Login')
    }
  }

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  }
 
  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  }


  render() {
    return (
      <Container style={styles.container}>  
        <Content >
        <View style={{ flex:1, alignItems:"center", paddingTop:40}}>
            <Image source={require('../../assets/chat.png')} style={styles.image} />
        </View>
        <View style={{ flex:1, alignItems:"center", paddingTop:40}}>
            <Text style={{fontSize:30, fontWeight:"bold"}}>Form Registration</Text>
        </View>
          {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
          <Form style={{marginTop:18}}>
          <Item>
              <Input 
                placeholder="Image URL"
                value={this.state.profile}
                onChangeText={this.handleChange('profile')} 
              />
            </Item>
            <Item>
              <Input 
                placeholder="Email"
                value={this.state.email}
                onChangeText={this.handleChange('email')} 
              />
            </Item>
            <Item>
              <Input 
                placeholder="Username"
                value={this.state.username}
                onChangeText={this.handleChange('username')} 
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
              {this.state.is_loading ? <ActivityIndicator size="large" color="#ffffff"/> : <Text>registration</Text>}
              </Button>
            </View>
          </Form>
          <View style={styles.registration}>
            <Text style={{textAlign:"center"}}>
            Already have an account?  
            </Text>
            <TouchableOpacity onPress={this.handleNavigate}>
              <Text style={{fontWeight:"bold"}}> Sign in</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  // Navbar
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
