import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableWithoutFeedback,
    Alert,
    Keyboard
} from 'react-native';
import { fetchLocations, fetchWeatherData, Images } from "../api/Weather";
import * as Location from 'expo-location';
import { SearchBar } from '../components/SearchBar';
import { ScrollBar } from '../components/ScrollBar';
import PagerView from "react-native-pager-view";
import { DayGraph } from "../components/DayGraph";
import { StatusBar } from 'expo-status-bar';

export function HomePage() {
    const [searchText, setSearchText] = useState('');
    const [locations, setLocations] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [weatherData, setWeatherData] = useState({});
    const [defaultLocation, setDefaultLocation] = useState(null);
    const [activePage, setActivePage] = useState(0);

    const requestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({});
            setDefaultLocation(loc);
        } else {
            Alert.alert(
                'Permission Denied',
                'We need location access to show relevant features.',
                [
                    { text: 'Cancel', onPress: () => console.log('Permission denied') },
                    { text: 'OK', onPress: () => Location.requestForegroundPermissionsAsync() },
                ],
                { cancelable: false }
            );
        }
    };

    useEffect(() => {
        requestLocationPermission();
    }, []);

    useEffect(() => {
        if (defaultLocation) {
            fetchWeatherData({
                latitude: defaultLocation.coords.latitude,
                longitude: defaultLocation.coords.longitude,
                days: 14
            })
                .then((data) => setWeatherData(data))
                .catch((err) => console.error('Error fetching weather data:', err));
        }
    }, [defaultLocation]);

    const handleSearchTextChange = (text) => {
        setSearchText(text);

        if (text.trim() === '') {
            setIsDropdownOpen(false);
        } else {
            fetchLocations({ cityName: text })
                .then((data) => {
                    setLocations(data);
                    setIsDropdownOpen(data.length > 0);
                })
                .catch(() => setIsDropdownOpen(false));
        }
    };

    const handleLocationSelect = (location) => {
        fetchWeatherData({ cityName: location.name, days: 7 })
            .then((data) => setWeatherData(data))
            .catch((err) => console.error('Error fetching weather data:', err));

        setSearchText(location.name);
        setIsDropdownOpen(false);
    };

    const handleOutsidePress = () => {
        Keyboard.dismiss();
        setIsDropdownOpen(false);
    };

    const getImage = (condition) => Images[condition] || Images['other'];

    return (
        <>
        <StatusBar style="light" />
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <SearchBar
                        onSearchTextChange={handleSearchTextChange}
                        onLocationSelect={handleLocationSelect}
                        locations={locations}
                        isDropdownOpen={isDropdownOpen}
                    />

                    {/* Main */}
                    <View style={{ flex: 1 }}>
                        <PagerView
                            style={styles.pagerView}
                            initialPage={0}
                            onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
                        >
                            <View key="1" style={styles.pageContainer}>
                                <Text style={styles.locationText}>
                                    {weatherData?.location?.name}
                                    {weatherData?.location?.country && (
                                        <Text style={styles.countryText}>
                                            , {weatherData?.location?.country}
                                        </Text>
                                    )}

                                </Text>
                                <View style={styles.weatherContainer}>
                                    {weatherData?.current && (
                                        <Image
                                            source={getImage(weatherData?.current?.condition?.text)}
                                            style={styles.weatherImage}
                                        />
                                    )}
                                    {weatherData?.current && (
                                        <View>
                                            <Text style={styles.tempText}>
                                                {weatherData?.current?.temp_c}°C
                                            </Text>
                                            <Text style={styles.conditionText}>
                                                {weatherData?.current?.condition?.text}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View key="2" style={styles.pageContainer}>
                                <DayGraph activePage={activePage} weatherData={weatherData} />
                            </View>
                        </PagerView>
                    </View>

                    <View style={styles.detailsContainer}>

                        {/* Wind Speed */}
                        <View style={styles.beltContainer}>
                            <Image source={require('../assets/img/wind.png')} style={styles.beltImage} />
                            <Text style={styles.beltText}>
                                {weatherData?.current?.wind_kph} km/h
                            </Text>
                        </View>

                        {/* Humidity */}
                        <View style={styles.beltContainer}>
                            <Image source={require('../assets/img/drop.png')} style={[styles.beltImage, { tintColor: 'gray' }]} />
                            <Text style={styles.beltText}>
                                {weatherData?.current?.humidity}%
                            </Text>
                        </View>

                        {/* Sunrise Time */}
                        <View style={styles.beltContainer}>
                            <Image source={require('../assets/img/sunrise.png')} style={[styles.beltImage, { tintColor: 'gray' }]} />
                            <Text style={styles.beltText}>
                                {weatherData?.forecast?.forecastday[0]?.astro?.sunrise || 'N/A'}
                            </Text>
                        </View>
                    </View>

                    <ScrollBar forecastData={weatherData?.forecast?.forecastday} />
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
        </>
    );
}

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
    },
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 26,
        fontWeight: 'bold',
    },
    countryText: {
        fontSize: 16,
        fontWeight: 'thin',
    },
    weatherContainer: {
        alignItems: 'center',
    },
    weatherImage: {
        width: 320,
        height: 300,
        resizeMode: 'contain',
    },
    tempText: {
        color: 'white',
        fontSize: 62,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    conditionText: {
        color: 'white',
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    beltContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    beltImage: {
        width: 44,
        height: 44,
        resizeMode: 'contain',
    },
    beltText: {
        marginLeft: 6,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
