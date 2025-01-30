import React from 'react';
import { View, ScrollView, Image, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export const ScrollBar = ({ forecastData }) => {
    return (
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
                {forecastData?.map((day, index) => (
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
    );
};

const styles = StyleSheet.create({
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
