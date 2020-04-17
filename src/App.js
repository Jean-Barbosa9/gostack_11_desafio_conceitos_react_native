import React, { Fragment, useState, useEffect } from "react";
import api from './services/api';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  async function getRepositories() {
    try {
      const { data } = await api.get('repositories');      
      setRepositories(data);

    } catch(error) {
      console.error(error);
    }
  } 

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);
    const repositoryLikesUpdated = repositories.map(repository => {  
      repository.id === id 
        ? repository.likes = response.data.likes
        : repository
      return repository  
    });

    setRepositories(repositoryLikesUpdated);
  }

  useEffect(() => {
    getRepositories();
  }, [])

  return (
    <Fragment>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        {
          repositories.length
          ? (
            <FlatList
              data={repositories}
              keyExtractor={repository => repository.id}
              renderItem={({item: repository}) => {
                const likesCount = repository.likes || 0;
                const likesGrammar = repository.likes > 1 
                                      ? 'curtidas' : 'curtida';

                return (
                  <View style={styles.repositoryContainer}>
                    <Text style={styles.repository}>{repository.title}</Text>
  
                    <View style={styles.techsContainer}>
                      { repository.techs.map(tech => (
                        <Text key={tech} style={styles.tech}>
                          {tech}
                        </Text>
                      ))}
                    </View>
  
                    <View style={styles.likesContainer}>
                      <Text
                        style={styles.likeText}
                        testID={`repository-likes-${repository.id}`}
                      >
                        {likesCount} {likesGrammar}
                      </Text>
                    </View>
  
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleLikeRepository(repository.id)}
                      testID={`like-button-${repository.id}`}
                    >
                      <Text style={styles.buttonText}>Curtir</Text>
                    </TouchableOpacity>
                  </View>
                );
              }
              
              }
            />
          )
          : (
            <View style={styles.centerContent}>
              <Text 
                style={[styles.bigText, styles.lightText, styles.centerText]}
              >
                Ainda não há repositórios cadastrados!
              </Text>
            </View>
          )
        }
        
      </SafeAreaView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  bigText: {
    fontSize: 30,
  },  
  lightText: {
    color: '#ffffff',
  }
});
