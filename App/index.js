// initial guidance from https://dev.to/nabendu82/simple-timer-app-with-react-native-434i

import React, { useState, useReducer, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
const screen = Dimensions.get('window');

const formatMillis = time => {
  const mins = Math.floor(time / 1000 / 60);
  const secs = Math.floor(time / 1000 - mins * 60);
  const millis = time - mins * 60 * 1000 - secs * 1000;
  return {
    minutes: String(mins).padStart(2, '0'),
    seconds: String(secs).padStart(2, '0'),
    milliseconds: String(millis).padStart(3, '0')
  }
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
  const [millis, setMillis] = useState(0);
  const interval = useRef();

  const handleStart = () => dispatch({ type: 'start', payload: new Date().getTime() });
  const handlePause = () => dispatch({ type: 'pause', payload: new Date().getTime() });
  const handleResume = () => dispatch({ type: 'resume', payload: new Date().getTime() });
  const handleReset = () => {
    setMillis(0);
    dispatch({ type: 'reset' })
  };

  useEffect(() => {
    if (state.isActive) {
      interval.current = setInterval(() => {
        setMillis(state.millisSaved + new Date().getTime() - state.lastStarted)
      }, 1);
    } else {
      clearInterval(interval.current);
    }
  }, [state.isActive]);

  const {minutes, seconds, milliseconds} = formatMillis(millis);

  return (
    <View style={styles.container}>

      <StatusBar barStyle="light-content" />

      <Text style={styles.timerText}>
        {minutes}:{seconds}:{milliseconds}
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
    fontSize: 80,
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
