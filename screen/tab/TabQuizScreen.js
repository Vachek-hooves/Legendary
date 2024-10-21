import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAppContext } from '../../store/context';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const TabQuizScreen = ({ navigation }) => {
  const { quizData } = useAppContext();

  const startQuiz = (sportId) => {
    const selectedSport = quizData.find((sport) => sport.id === sportId);
    navigation.navigate('StackQuizLevelScreen', { sport: selectedSport });
  };

  return (
    <ImageBackground
      source={require('../../assets/image/newBg/bg.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <SafeAreaView/>
        <Text style={styles.title}>Choose a Sport</Text>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {quizData.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              onPress={() => startQuiz(sport.id)}
              style={[styles.sportButton, !sport.isActive && styles.inactiveButton]}
              disabled={!sport.isActive}
            >
              <LinearGradient
                colors={['#1e7600', '#02909c', '#181818']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <Text style={styles.sportButtonText}>{sport.sport}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  sportButton: {
    width: width * 0.8,
    height: 160,
    marginBottom: 15,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    opacity: 0.9
  },
  inactiveButton: {
    opacity: 0.4,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  sportButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});

export default TabQuizScreen;
