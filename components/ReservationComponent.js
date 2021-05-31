import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet,
    Picker, Switch, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import * as Notifications from 'expo-notifications';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state ={
            campers: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false,
        };
    }

    static navigationOptions = {
        title: 'Reserve Campsite'
    }

    handleReservation() {// I tend to name things as I feel when dealing with them
        const bsAlert = `Number of Campers ${this.state.campers} 
        \nHike-in?: ${this.state.hikeIn} 
        \nDate: ${this.state.date.toLocaleDateString('en-US')}`
        
            Alert.alert(
                'Begin search?',
                bsAlert,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => {
                            console.log('Cancel pressed');
                            this.resetForm();
                        }              
                    },
                    {
                        text: 'OK',
                        onPress: () => {
                            this.presentLocalNotification(this.state.date.toLocaleDateString('en-US'));
                            this.resetForm()
                        }
                    }
                ],
                { cancelable: false }
            )
            console.log(JSON.stringify(this.state));
        }

    

    resetForm() {
        this.setState({
            campers: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false,
        })
    }

    async presentLocalNotification(date) {
        function sendNotifcation() {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true
                })
            });

            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Your Campsite Reservation Search',
                    body: `Search for ${date} requested`
                },
                trigger: null
            });
        }// await is only usable in async functions followed by a promise
        let permissions = await Notifications.getPermissionsAsync();
        if (!permissions.granted) {
            permissions = await Notifications.requestPermissionsAsync();
        }
        if (permissions.granted) {
            sendNotifcation();
        }
    }

    render() {
        return (
            <ScrollView>
                <Animatable.View animation='zoomIn' duration={2000} delay={1000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Campers</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.campers}
                            onValueChange={itemValue => this.setState({campers: itemValue})}
                        >
                            <Picker.item label='1' value='1' />
                            <Picker.item label='2' value='2' />
                            <Picker.item label='3' value='3' />
                            <Picker.item label='4' value='4' />
                            <Picker.item label='5' value='5' />
                            <Picker.item label='6' value='6' />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Hike-in?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.hikeIn}
                            trackColor={{true: '#5637DD', false: null}}
                            onValueChange={value => this.setState({hikeIn: value})}
                        />
                    </View>
                    <View style={styles.formRow}> 
                        <Text style={styles.formLabel}>Date</Text>
                        <Button
                            onPress={() =>
                                this.setState({showCalendar: !this.state.showCalendar})
                            }
                            title={this.state.date.toLocaleDateString('en-US')}
                            color='#5637DD'
                            accessibilityLabel='Tap me to select a reservation date'
                        />
                    </View>
                    {this.state.showCalendar && (
                        <DateTimePicker
                            value={this.state.date}
                            mode={'date'}
                            display='default'
                            onChange={(event, selectedDate) => {
                                selectedDate && this.setState({date: selectedDate, showCalendar: false})
                            }}
                            style={styles.formItem}
                        />
                    )}
                    <View style={styles.formRow}>
                        <Button
                            onPress={() => this.handleReservation()}
                            title='Search'
                            color='#5637DD'
                            accessibilityLabel='Tap me to search for available campsites to reserve'
                            
                        />
                    </View>
                </Animatable.View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    }    
});

export default Reservation;