import React, { useState } from 'react';
import {
    TextInput,
    TouchableOpacity,
    FlatList,
    Text,
    StyleSheet,
    View
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export const SearchBar = ({ onSearchTextChange, onLocationSelect, locations, isDropdownOpen }) => {
    const handleSearchTextChange = (text) => {
        onSearchTextChange(text); // Callback to update parent component
    };

    return (
        <View style={styles.searchBarContainer}>
            {/* Search Bar */}
            <TouchableOpacity
                style={styles.searchBar}
                activeOpacity={1}
            >
                <TextInput
                    style={styles.inputBar}
                    placeholder="Search City"
                    placeholderTextColor="white"
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
                            onPress={() => onLocationSelect(item)} // Callback to handle selection
                        >
                            <Text style={styles.dropDownItemText}>
                                {item.name}, {item.country}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchBarContainer: {
        zIndex: 99,
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
});
