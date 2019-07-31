import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import firebase from 'firebase'
import { GiftedChat } from 'react-native-gifted-chat'


export default class DetailChat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: this.props.navigation.state.params.username,
            uid: this.props.navigation.state.params.uid,
            profile:this.props.navigation.state.params.profile,
            text: '',
            messagesList: [],
            
        }
    }
    async componentWillMount() {
        this.setState({
            myuid: await AsyncStorage.getItem('uid'),
            
        })
              
        await firebase.database().ref('messages').child(this.state.uid).child(this.state.myuid)
            .on('child_added', (value) => {
                this.setState((previousState) => {
                    return {
                        messagesList: GiftedChat.append(previousState.messagesList, value.val()),
                    }
                })
            })
    }

    static navigationOptions = ({navigation}) => {
        return{
            title : navigation.getParam('username', null)
        }
    }

    sendMessage = async () => {
        if (this.state.text.length > 0) {
            let msgId = firebase.database().ref('messages').child(this.state.myuid).child(this.state.uid).push().key;
            let updates = {};
            let message = {
                _id: msgId,
                text: this.state.text,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                user: {
                    _id     : this.state.myuid,
                }
            }
            updates['messages/' + this.state.myuid + '/' + this.state.uid + '/' + msgId] = message;
            updates['messages/' + this.state.uid + '/' + this.state.myuid + '/' + msgId] = message;
            firebase.database().ref().update(updates)
            this.setState({ text: '' })

        }

        
    }
    render() {
        return (
            <GiftedChat
                text={this.state.text}
                messages={this.state.messagesList}
                onSend={this.sendMessage}
                user={{
                    _id: this.state.myuid,
                    name: this.state.username,
                    avatar : this.state.profile,
                }}
                onInputTextChanged={(value) => this.setState({ text: value })}
            />
        )
    }
}