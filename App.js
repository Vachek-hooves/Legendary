import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  AppState,
  Image,
  Animated,
  View,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { AppContextProvider } from './store/context';
import WelcomeScreen from './screen/stack/WelcomeScreen';
import {
  TabFootbalIntroScreen,
  TabQuizScreen,
  TabTrainingScreen,
  TabUserScreen,
  TabChronologyScreen,
} from './screen/tab';
import {
  StackFootballPlay,
  StackLegendarySportMoments,
  StackQuizLevelScreen,
  StackTrainingDetailScreen,
  StackTrainingProgramScreen,
} from './screen/stack';
import {
  playBackgroundMusic,
  resetPlayer,
} from './components/bgSound/setupPlayer';
import userIcon from './assets/icons/user.png';
import footballIcon from './assets/icons/football.png';
import quizIcon from './assets/icons/quiz.png';
import trainingIcon from './assets/icons/training.png';
import chronology from './assets/icons/chronology.png';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const loaders = [
  require('./assets/image/newLoaders/loader1.png'),
  require('./assets/image/newLoaders/loader2.png'),
];

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <LinearGradient
      colors={['#1e7600', '#02909c', '#181818']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flexDirection: 'row',
        height: 110,
        elevation: 8,
        shadowColor: '#00ff00',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Add this function to get the icon based on the route name
        const getTabIcon = (routeName) => {
          switch (routeName) {
            case 'TabUserScreen':
              return userIcon;
            case 'TabFootbalIntroScreen':
              return footballIcon;
            case 'TabQuizScreen':
              return quizIcon;
            case 'TabTrainingScreen':
              return trainingIcon;
            case 'TabChronologyScreen':
              return chronology;
            default:
              return null;
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Image
              source={getTabIcon(route.name)}
              style={{
                width: 40,
                height: 40,
                marginBottom: 2,
                tintColor: isFocused ? '#8cc41a' : '#ffffff',
              }}
            />
            <Text
              style={{
                color: isFocused ? '#8cc41a' : '#ffffff',
                fontWeight: 'bold',
                fontSize: 12,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </LinearGradient>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="TabUserScreen"
        component={TabUserScreen}
        options={{ tabBarLabel: 'User' }}
      />
      <Tab.Screen
        name="TabFootbalIntroScreen"
        component={TabFootbalIntroScreen}
        options={{ tabBarLabel: 'Football' }}
      />
      <Tab.Screen
        name="TabQuizScreen"
        component={TabQuizScreen}
        options={{ tabBarLabel: 'Quiz' }}
      />
      <Tab.Screen
        name="TabChronologyScreen"
        component={TabChronologyScreen}
        options={{ tabBarLabel: 'moments' }}
      />
      <Tab.Screen
        name="TabTrainingScreen"
        component={TabTrainingScreen}
        options={{ tabBarLabel: 'Training' }}
      />
    </Tab.Navigator>
  );
};

function App() {
  const [currentLoader, setCurrentLoader] = useState(0);
  const fadeAnim1 = useRef(new Animated.Value(1)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await playBackgroundMusic();
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };

    initializePlayer();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        resetPlayer();
      } else if (nextAppState === 'active') {
        playBackgroundMusic();
      }
    });

    return () => {
      subscription.remove();
      resetPlayer();
    };
  }, []);

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      fadeToNextLoader();
    }, 1500); // Start transition after 3 seconds

    const navigationTimeout = setTimeout(() => {
      navigateToMenu();
    }, 4000);

    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(navigationTimeout);
    };
  }, []);

  const fadeToNextLoader = () => {
    Animated.parallel([
      Animated.timing(fadeAnim1, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentLoader(1);
    });
  };

  const navigateToMenu = () => {
    setCurrentLoader(2);
  };

  return (
    <AppContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 1000,
          }}
        >
          {currentLoader < 2 ? (
            <Stack.Screen name="Welcome" options={{ headerShown: false }}>
              {() => (
                <View style={{ flex: 1 }}>
                  <Animated.Image
                    source={loaders[0]}
                    style={[
                      { width: '100%', height: '100%', position: 'absolute' },
                      { opacity: fadeAnim1 },
                    ]}
                  />
                  <Animated.Image
                    source={loaders[1]}
                    style={[
                      { width: '100%', height: '100%', position: 'absolute' },
                      { opacity: fadeAnim2 },
                    ]}
                  />
                </View>
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            // <Stack.Screen name="TabNavigator" component={TabNavigator} />
          )}
          {/* <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} /> */}
          <Stack.Screen name="TabNavigator" component={TabNavigator} />

          <Stack.Screen
            name="StackFootballPlay"
            component={StackFootballPlay}
          />
          <Stack.Screen
            name="StackQuizLevelScreen"
            component={StackQuizLevelScreen}
          />
          <Stack.Screen
            name="StackTrainingDetailScreen"
            component={StackTrainingDetailScreen}
          />
          <Stack.Screen
            name="StackTrainingProgramScreen"
            component={StackTrainingProgramScreen}
          />
          <Stack.Screen
            name="StackLegendarySportMoments"
            component={StackLegendarySportMoments}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContextProvider>
  );
}

export default App;
