// initial guidance from https://dev.to/nabendu82/simple-timer-app-with-react-native-434i

import React, { useReducer } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
const screen = Dimensions.get('window');

const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = time => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return { mins: formatNumber(mins), secs: formatNumber(secs) };
}

const initialState = {
  millisSaved: 0,
  lastStarted: 0,
  isActive: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'start':
      return {
        millisSaved: 0,
        lastStarted: action.payload,
        isActive: true,
      }
    case 'pause':
      return {
        millisSaved: state.millisSaved + action.payload - state.lastStarted,
        lastStarted: null,
        isActive: false,
      }
    case 'resume':
      return {
        millisSaved: state.millisSaved,
        lastStarted: action.payload,
        isActive: true,
      }
    case 'reset':
      return { ...initialState };
    default:
      throw new Error();
  }
}


export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const handleStart = () => dispatch({ type: 'start', payload: new Date().getTime() });
  const handlePause = () => dispatch({ type: 'pause', payload: new Date().getTime() });
  const handleResume = () => dispatch({ type: 'resume', payload: new Date().getTime() });
  const handleReset = () => dispatch({ type: 'reset' });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.timerText}>
        {state.isActive
          ? state.millisSaved + new Date().getTime() - state.lastStarted
          : state.millisSaved
        }
      </Text>

      <TouchableOpacity onPress={handleReset} style={[styles.buttonReset]}>
        <Text style={[styles.buttonText, styles.buttonTextReset]}>
          Reset
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={state.isActive ? handlePause : state.millisSaved ? handleResume : handleStart} style={styles.button}>
        <Text style={styles.buttonText}>
          {state.isActive ? 'Pause' : state.millisSaved ? 'Resume' : 'Start'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111B1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderWidth: 6,
    borderColor: '#B4D6E3',
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 45,
    color: '#B4D6E3',
  },
  timerText: {
    color: '#fff',
    fontSize: 110,
    marginBottom: 20,
  },
  buttonReset: {
    marginBottom: 120,
  },
  buttonTextReset: {
    fontSize: 30,
    color: '#999999',
  },
});
