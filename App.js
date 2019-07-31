
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';

import Login            from './src/public/screen/Login';
import Registration     from './src/public/screen/Registration';
import Maps             from './src/public/screen/Maps';
import ListChat         from './src/public/screen/ListChat';
import Chat             from './src/public/screen/Chat';
import Profile          from './src/public/screen/Profile';
import FriendProfile    from './src/public/screen/FriendProfile';
import AuthLoading      from './src/public/screen/AuthLoading';

const AuthStack = createStackNavigator({ 
  Login: Login,
  Registration: Registration 
},{
headerMode:'none'
});

const AppStack = createStackNavigator({ 
  Maps: {
    screen : Maps,
    navigationOptions: {
      header: null,
    },
  }, 
  ListChat,
  Chat,
  Profile :{
    screen : Profile,
    navigationOptions: {
      header: null,
    },
  },
  FriendProfile :{
    screen : FriendProfile,
    navigationOptions: {
      header: null,
    },
  },
  
});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
   
  }
));

