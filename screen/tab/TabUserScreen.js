import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SoundControl from '../../components/bgSound/Control';

const TabUserScreen = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setName(parsedUser.name);
        setGender(parsedUser.gender);
        setImage(parsedUser.image);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async () => {
    const userData = { name, gender, image };
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImage(response.assets[0].uri);
      }
    });
  };

  const renderForm = () => (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#00ff00"
        value={name}
        onChangeText={setName}
      />
      <View style={styles.genderContainer}>
        {['male', 'female', 'skip'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.genderButton,
              gender === option && styles.selectedGender
            ]}
            onPress={() => setGender(option)}
          >
            <Text style={styles.genderText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Choose Profile Picture</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={saveUserData}>
        <LinearGradient
          colors={['#00ff00', '#808080', '#4682B4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Save</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderUserInfo = () => (
    <View style={styles.userInfo}>
      <Image source={{ uri: image }} style={styles.profileImage} />
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userGender}>{user.gender !== 'skip' ? user.gender : 'Not specified'}</Text>
      <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
        <LinearGradient
          colors={['#00FFFF', '#FF00FF', '#FF1493']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const backgroundImage = gender === 'female' 
    ? require('../../assets/image/user/newShe.png')
    : gender === 'male'
    ? require('../../assets/image/user/newHe.png')
    : require('../../assets/image/newBg/bg.png');

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <LinearGradient
        colors={['rgba(0,255,0,0.0)', 'rgba(128,128,128,0.0)', 'rgba(70,130,180,0.0)']}
        style={styles.overlay}
      >
        <SafeAreaView />
        <SoundControl />
        <View style={styles.container}>
          {user && !isEditing ? renderUserInfo() : renderForm()}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default TabUserScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 160,
  },
  container: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(70,130,180,0.1)',
    borderColor: '#00ff00',
    borderWidth: 1,
  },
  form: {
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#00ff00',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#00ff00',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00ff00',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedGender: {
    backgroundColor: 'rgba(0,255,0,0.3)',
  },
  genderText: {
    color: '#00ff00',
  },
  imageButton: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00ff00',
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButton: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 5,
  },
  gradient: {
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#00ff00',
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderColor: '#00ff00',
    borderWidth: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 10,
  },
  userGender: {
    fontSize: 18,
    color: '#00ff00',
    marginBottom: 20,
  },
  editButton: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 5,
  },
});
