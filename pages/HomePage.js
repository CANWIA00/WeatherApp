import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {fetchLocations, fetchWeatherData, Images} from "../api/Weather";

export default function HomePage() {
    const [searchText, setSearchText] = useState('');
    const [locations,setLocations] = useState([]); // Example location data
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [weatherData, setWeatherData] = useState({});


    const handleSearchTextChange = (text) => {
        setSearchText(text);


        if (text.trim() === '') {
            setIsDropdownOpen(false);
        } else {

            fetchLocations({ cityName: text })
                .then((data) => {
                    if (data && data.length > 0) {
                        setLocations(data);
                        setIsDropdownOpen(true);
                    } else {
                        setLocations([]);
                        setIsDropdownOpen(false);
                    }
                })
                .catch((err) => {
                    console.error('Error fetching locations:', err);
                    setIsDropdownOpen(false);
                });
        }
    };

    const getImage = (condition) => {
        if (Images[condition]) {
            return Images[condition];
        }
        return Images['other'];
    };




    const handleLocationSelect = (location) => {
        console.log('Selected location:', location);


        fetchWeatherData({ cityName: location.name, days: 7 })
            .then((data) => {
                if (data) {
                    setWeatherData(data);
                    console.log('Weather data:', data);
                } else {
                    console.warn('Weather data not found!');
                }
            })
            .catch((err) => console.error('Error fetching weather data:', err));

        setSearchText(location.name);
        setIsDropdownOpen(false);
    };




    const handleOutsidePress = () => {
        Keyboard.dismiss();
        setIsDropdownOpen(false);
    };


    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.searchBarContainer}>
                    {/* Search Bar */}
                    <TouchableOpacity
                        style={styles.searchBar}
                        activeOpacity={1}
                        onPress={handleSearchTextChange}
                    >

                    <TextInput
                        style={styles.inputBar}
                        placeholder="Search City"
                        placeholderTextColor="white"
                        value={searchText}
                        onChangeText={handleSearchTextChange}
                        editable={true}
                        />
                        <TouchableOpacity style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>
                                <Feather name="search" size={24} color="white" />
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                    {/* Dropdown */}
                    {isDropdownOpen && locations.length > 0 && (
                        <FlatList
                            data={locations}
                            keyExtractor={(item) => item.id.toString()}
                            style={styles.dropDown}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropDownItem}
                                    onPress={() => handleLocationSelect(item)}
                                >
                                    <Text style={styles.dropDownItemText}>
                                        {item.name}, {item.country}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}




                </View>
                {/* Main */}
                <View style={{ marginHorizontal: 15, flex: 1, justifyContent: 'center' }}>
                    {/* Location */}
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 26, fontWeight: 'bold' }}>
                        {weatherData?.location?.name},
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'thin' }}>
                            {weatherData?.location?.country}
                        </Text>
                    </Text>

                    {/* Weather Image */}
                    <View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {weatherData?.current && (
                            <Image
                                source={getImage(weatherData?.current?.condition?.text)}
                                style={{
                                    width: 320,
                                    height: 300,
                                    resizeMode: 'contain',
                                }}
                            />
                        )}

                        {weatherData?.current && (
                            <View style={{ position: 'relative', justifyContent: 'space-between' }}>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 62,
                                        fontWeight: 'bold',
                                        marginBottom: 25,
                                        textAlign: 'center',
                                    }}
                                >
                                    {weatherData?.current?.temp_c}°C
                                </Text>
                                <Text style={{ color: 'white', fontSize: 42, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
                                    {weatherData?.current?.condition?.text} {/* Weather condition */}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>

                    {/* Wind Speed */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20 }}>
                        <Image source={require('../assets/img/wind.png')} style={styles.beltImage} />
                        <Text style={styles.beltText}>
                            {weatherData?.current?.wind_kph} km/h
                        </Text>
                    </View>

                    {/* Humidity */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20 }}>
                        <Image source={require('../assets/img/drop.png')} style={[styles.beltImage, { tintColor: 'gray' }]} />
                        <Text style={styles.beltText}>
                            {weatherData?.current?.humidity}%
                        </Text>
                    </View>

                    {/* Sunrise Time */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20 }}>
                        <Image source={require('../assets/img/sunrise.png')} style={[styles.beltImage, { tintColor: 'gray' }]} />
                        <Text style={styles.beltText}>
                            {weatherData?.forecast?.forecastday[0]?.astro?.sunrise || 'N/A'}
                        </Text>
                    </View>
                </View>

                {/* forecast for next days */}
                <View style={{ marginTop: 15, marginBottom: 20, marginHorizontal: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <AntDesign name="calendar" size={24} color="white" />
                        <Text style={styles.beltText}>Daily forecast</Text>
                    </View>

                    <ScrollView
                        horizontal={true}
                        contentContainerStyle={{ paddingHorizontal: 15 }}
                        showsHorizontalScrollIndicator={false}
                    >
                        {weatherData?.forecast?.forecastday?.map((day, index) => (
                            <View
                                key={index}
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                    paddingBottom: 10,
                                    paddingHorizontal: 10,
                                }}
                            >

                                <Image
                                    source={{ uri: `https:${day.day.condition.icon}` }}
                                    style={styles.beltImage}
                                />

                                <Text style={styles.beltText}>
                                    {new Date(day.date).toLocaleString('en-us', { weekday: 'long' })}
                                </Text>

                                <Text style={styles.beltText}>
                                    {day.day.avgtemp_c}°C
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    safeArea: {
        flex: 1,
    },
    searchBarContainer: {
        zIndex:99,
        marginHorizontal: 16,
        marginTop: 16,
    },
    searchBar: {
        marginTop: 24,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'grey',
        opacity: 0.9,
        borderRadius: 50,
        paddingLeft: 16,
        paddingRight: 4,
    },
    inputBar: {
        flex: 1,
        height: 50,
        color: 'white',
        fontSize: 16,
    },
    searchButton: {
        marginLeft: 8,
        backgroundColor: 'black',
        borderRadius: 100,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    searchButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    dropDown: {
        maxHeight: 200,
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        marginTop: 8,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 999,
    },
    dropDownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#3a3a3a',
    },
    dropDownItemText: {
        fontSize: 16,
        color: 'white',
    },
    beltImage:{
        width: 44,
        height: 44,
        resizeMode: 'contain',
    },
    beltText:{
        marginLeft: 6,
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
    }
});
