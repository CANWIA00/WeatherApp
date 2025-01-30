import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from "react-native";
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const DayGraph = ({ activePage, weatherData }) => {
    const [hourlyData, setHourlyData] = useState([]);
    const animationValues = useRef([]).current;

    const getTitleMessage = () => {
        if (weatherData?.current?.condition?.text) {
            const condition = weatherData.current.condition.text;

            switch (condition) {
                case 'Sunny':
                case 'Clear':
                    return "Don't forget to get sunglasses! 😎";
                case 'Snow':
                    return "Don't forget your gloves! 🧤";
                case 'Partly cloudy':
                    return "It might be partly cloudy, stay prepared! 🧣";
                case 'Moderate rain':
                case 'Heavy rain':
                case 'Heavy rain at times':
                    return "Don't forget your umbrella! ☂️";
                case 'Overcast':
                    return "It looks overcast, stay cozy! 🍂";
                case 'Mist':
                    return "It might be misty, be cautious! 🌫️";
                case 'Moderate rain at times':
                    return "Moderate rain expected, carry an umbrella! ️☂️";
                case 'Patchy rain possible':
                    return "Patchy rain possible, keep an umbrella handy! ☂️";
                default:
                    return "Have a nice day! ☺️";
            }
        }
        return "Have a nice day!";
    };

    useEffect(() => {
        if (weatherData?.forecast?.forecastday?.[0]?.hour) {
            const newHourlyData = weatherData.forecast.forecastday[0].hour
                .filter((hour) => [6, 9, 12, 15, 18, 21].includes(new Date(hour.time).getHours()))
                .map((hour) => ({
                    time: new Date(hour.time).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                    temp: hour.temp_c,
                }));

            setHourlyData(newHourlyData);
            animationValues.length = newHourlyData.length;
            newHourlyData.forEach((_, index) => animationValues[index] = new Animated.Value(0));
        }
    }, [weatherData]);

    useEffect(() => {
        if (activePage === 1 && hourlyData.length > 0) {
            animationValues.forEach(value => value.setValue(0));
            const animations = hourlyData.map((_, index) =>
                Animated.timing(animationValues[index], {
                    toValue: Math.abs(hourlyData[index].temp) * 5,
                    duration: 800,
                    useNativeDriver: false,
                })
            );

            Animated.stagger(100, animations).start();
        }
    }, [activePage, hourlyData]);

    const getBarColor = (temp) => {
        return temp < 0 ? '#2196F3' : '#FF5722';
    };

    const titleMessage = getTitleMessage();

    return (
        <View style={styles.container}>
            {/* Dynamic title message */}
            <Text style={styles.titleBar}>{titleMessage}</Text>

            <View style={styles.card}>
                <Text style={styles.title}>Temperature °C</Text>
                <View style={styles.graphWithYAxis}>
                    <View style={styles.graphContainer}>
                        {hourlyData.map((item, index) => (
                            <View key={index} style={styles.barContainer}>
                                <Animated.View
                                    style={[
                                        styles.bar,
                                        { height: animationValues[index], backgroundColor: getBarColor(item.temp) },
                                    ]}
                                />

                                <Text style={styles.tempLabel}>{item.temp}°C</Text>
                                <Text style={styles.timeLabel}>{item.time}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleBar: {
        color: 'white',
        fontSize: 26,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 50,
    },
    card: {
        backgroundColor: '#1e1e1e',
        width: '90%',
        height: '50%',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    title: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    graphWithYAxis: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
    graphContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        width: '100%',
        height: '100%',
        marginBottom: 20,
    },
    barContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    bar: {
        width: 25,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    tempLabel: {
        color: '#ffccbc',
        fontSize: 12,
        marginTop: 5,
    },
    timeLabel: {
        color: '#ffffff',
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
    },
});
