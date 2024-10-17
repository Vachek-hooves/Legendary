import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Modal, ScrollView, ImageBackground, SafeAreaView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { moments } from '../../data/moments';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TabChronologyScreen = () => {
  const [selectedMoment, setSelectedMoment] = React.useState(null);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.yearContainer}>
        <View style={styles.line} />
        <View style={styles.dot} />
        <Text style={styles.year}>{new Date(item.date).getFullYear()}</Text>
      </View>
      <TouchableOpacity style={styles.card} onPress={() => setSelectedMoment(item)}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.header}>{item.header}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground 
      source={require('../../assets/image/bg/chronologybg.png')}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)']}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.container}>
          <FlatList
            data={moments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
          <Modal
            visible={selectedMoment !== null}
            animationType="slide"
            onRequestClose={() => setSelectedMoment(null)}
            transparent={true}
          >
            {selectedMoment && (
              <View style={styles.modalOverlay}>
                <ScrollView style={styles.modalContainer}>
                  <Image source={selectedMoment.image} style={styles.modalImage} />
                  <View style={styles.modalContent}>
                    <Text style={styles.modalHeader}>{selectedMoment.header}</Text>
                    <Text style={styles.modalArticle}>{selectedMoment.article}</Text>
                    <Text style={styles.modalMoreDetail}>{selectedMoment.moreDetail}</Text>
                    <TouchableOpacity
                      onPress={() => setSelectedMoment(null)}
                      style={styles.buttonContainer}
                    >
                      <LinearGradient
                        colors={['#FF1493', '#FF00FF', '#00FFFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                      >
                        <Text style={styles.buttonText}>Close</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            )}
          </Modal>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  yearContainer: {
    width: 60,
    alignItems: 'center',
  },
  line: {
    width: 2,
    height: '100%',
    backgroundColor: '#00FFFF',
    position: 'absolute',
    left: 29,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF00FF',
    marginTop: 5,
  },
  year: {
    marginTop: 5,
    fontWeight: 'bold',
    color: 'white',
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 10,
  },
  header: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#00FFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContainer: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: SCREEN_HEIGHT*0.8,
  },
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFFF',
    marginVertical: 10,
  },
  modalArticle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  modalMoreDetail: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#FF00FF',
    marginBottom: 20,
  },
  buttonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TabChronologyScreen;
