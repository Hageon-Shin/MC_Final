import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';


import database from './database99.json';

const App = () => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showbutton, setShowButton] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [mealInput, setMealInput] = useState('');
  const [displayedInfo, setDisplayedInfo] = useState(null);
  const [savedData, setSavedData] = useState({});

  const databaseArray = Object.values(database);

  const handleChoiceSelection = (choice) => {
    setSelectedChoice(choice);
    setShowCalendar(true);
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date.dateString);
    setShowButton(true);
    setShowInput(false);
    setDisplayedInfo(null);
    setMealInput('');
  };

  const handleShowButton = () => {
    const data = savedData[selectedDate];
    if (data) {
      setDisplayedInfo(data);
      setShowInput(true);
      setShowButton(false);
    }
  };
  const handleSaveButton = () => {
    setShowInput(true);
    setMealInput('');
    setShowButton(false); 
  };

  const handleMealSelection = (meal) => {
    setShowInput(true);
    setMealInput(meal);
  };

  const handleTextInput = (text) => {
    setMealInput(text);
  };

  const handleSubmit = () => {
    const userInput = mealInput.trim().toLowerCase();

    if (userInput === '') {
      console.log('Please enter a valid input');
      return;
    }

    const data = databaseArray.find((item) => {
      const name = item.name ? item.name.toLowerCase() : '';
      return name === userInput;
    });

    if (data) {
      const newData = {
        meal: mealInput,
        data: data,
      };

      const existingData = savedData[selectedDate] || [];

      const updatedData = [...existingData, newData];

      setSavedData({ ...savedData, [selectedDate]: updatedData });
      setDisplayedInfo(updatedData);
    } else {
      setDisplayedInfo(null);
    }
  };

  const handleBackButton = () => {
    setSelectedChoice(null);
    setShowCalendar(true);
    setSelectedDate(null);
    setShowInput(false);
    setMealInput('');
    setDisplayedInfo(null);
  };

  return (
    <View style={styles.container}>
      {!displayedInfo ? (
        <>
          {!showCalendar && !selectedDate && !showInput ? (
            <View style={styles.buttonContainer}>
              <Text style={styles.question}>Do you have any significant health problem?</Text>
              <TouchableOpacity
                style={[
                  styles.choiceButton,
                  selectedChoice === 'Diabetes' ? styles.selectedChoice : null,
                ]}
                onPress={() => handleChoiceSelection('Diabetes')}
              >
                <Text style={styles.choiceText}>Diabetes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.choiceButton,
                  selectedChoice === 'Kidney Stone' ? styles.selectedChoice : null,
                ]}
                onPress={() => handleChoiceSelection('Kidney Stone')}
              >
                <Text style={styles.choiceText}>Kidney Stone</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.choiceButton,
                  selectedChoice === 'Obesity' ? styles.selectedChoice : null,
                ]}
                onPress={() => handleChoiceSelection('Obesity')}
              >
                <Text style={styles.choiceText}>Obesity</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.calendarContainer}>
              {showCalendar && !selectedDate && <Calendar onDayPress={handleDateSelection} />}

              {selectedDate && showbutton && (
                <View style={styles.mealButtonsContainer}>
                  <Text style={styles.inputLabel}>Choose your action:</Text>
                  <TouchableOpacity style={styles.mealButton} onPress={handleSaveButton}>
                    <Text style={styles.mealButtonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.mealButton} onPress={handleShowButton}>
                    <Text style={styles.mealButtonText}>Show</Text>
                  </TouchableOpacity>
                </View>
              )}

              {showInput && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>What did you eat?</Text>
                  <TextInput
                    style={styles.input}
                    value={mealInput}
                    onChangeText={handleTextInput}
                    placeholder="Enter information"
                  />

                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit & Save</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </>
      ) : (
        <View style={styles.displayContainer}>         
          {displayedInfo.map((data, index) => (
            <View key={index}>
              <Text style={styles.infoText}>-----------------------------------------</Text>
          <Text style={styles.infoText}>Nutrition facts: </Text>
              <Text style={styles.infoText}>Calories: {data.data.kcal}</Text>
              <Text style={styles.infoText}>Protein: {data.data.prot}</Text>
              <Text style={styles.infoText}>Carbohydrate: {data.data.carbo}</Text>
              <Text style={styles.infoText}>Fat: {data.data.fat}</Text>
              <Text style={styles.infoText}>Features: {data.data.char}</Text>
              <Text style={styles.infoText}>Date: {selectedDate}</Text>
              <Text style={styles.infoText}>-----------------------------------------</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  choiceButton: {
    width: 150,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  choiceText: {
    fontSize: 16,
  },
  selectedChoice: {
    backgroundColor: '#a5d6a7',
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  mealButtonsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  mealButton: {
    width: 120,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealButtonText: {
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  submitButton: {
    width: 120,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#000',
  },
  displayContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  backButton: {
    width: 120,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#090',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default App;
