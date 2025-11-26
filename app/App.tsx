// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { Welcome } from './components/Welcome';
// import { DifficultySelection } from './components/DifficultyLevel';

// export type RootStackParamList = {
//   Welcome: undefined;
//   Difficulty: undefined;
// };

// const Stack = createStackNavigator<RootStackParamList>();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Welcome"
//         screenOptions={{ headerShown: false }}
//       >
//         <Stack.Screen name="Welcome" component={WelcomeScreen} />
//         <Stack.Screen name="Difficulty" component={DifficultyScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// // Wrappers to handle props
// function WelcomeScreen({ navigation }: any) {
//   return <Welcome onStart={() => navigation.navigate('Difficulty')} />;
// }

// function DifficultyScreen({ navigation }: any) {
//   return (
//     <DifficultySelection
//       onSelectDifficulty={(difficulty) =>
//         console.log('Selected difficulty:', difficulty)
//       }
//     />
//   );
// }
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Import your screens
import {DifficultySelection } from '../screens/DifficultyLevel';
import Welcome  from '../screens/Welcome';
import Dashboard from './dashboard';

// Navigation types
export type RootStackParamList = {
  Dashboard: undefined;
  Welcome: undefined;
  Difficulty: undefined;
};

// Create Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();
const DashboardComponent: any = Dashboard;

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"   // 👈 FIRST SCREEN
        screenOptions={{ headerShown: false }}
      >
        {/* MAIN SCREENS */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Difficulty" component={DifficultyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ------------------------------------------------------------------
   WRAPPER SCREENS
   (Used to pass custom props to components)
-------------------------------------------------------------------*/
function DashboardScreen({ navigation }: any) {
  return (
    <DashboardComponent
      onGoToWelcome={() => navigation.navigate('Welcome')}
    />
  );
}


function WelcomeScreen({ navigation }: any) {
  return (
    <Welcome
      onStart={() => navigation.navigate('Difficulty')}
    />
  );
}

function DifficultyScreen({ navigation }: any) {
  return (
    <DifficultySelection
      onSelectDifficulty={(difficulty) => {
        console.log('Selected difficulty:', difficulty);
        // Optional:
        // navigation.navigate('Dashboard');
      }}
    />
  );
}
