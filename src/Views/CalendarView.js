import React from "react";
import moment from "moment";
import { StyleSheet, Text, Dimensions, View, TouchableHighlight, Alert } from "react-native";
import BaseView from "./BaseView";
import { Calendar } from 'react-native-calendars';
import { SALMON } from "../constants";
import firebase, { auth } from "../../firebase";

export default class CalendarView extends BaseView {
    constructor(props){
        super(props)
        this.createBooking = this.createBooking.bind(this);
        this.markDate = this.markDate.bind(this);

        this.state = { 
            markedDates: {},
            selectedDates: {} 
        };
    }

    createBooking() {
        const { markedDates, selectedDates } = this.state;
        const { navigate } = this.props.navigation;
        let calls = Object.keys(selectedDates).map(d => {
            return fetch("https://foodu-api.herokuapp.com/api/v1/bookings", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "foodTruckId": auth.currentUser.uid, 
                    "date": d
                })
            })
        })

        Promise.all( 
            calls
        )
        .catch(error => {
            Alert.alert("Error", "An error has occured when submitting your schedule. Please try again.")
        })
        .then(response => {
            navigate("ScheduleWeek")
        });
    }

    markDate = (day) => {
        const selectedDay = moment(day.dateString).format("YYYY-MM-DD");
        let selected = true;
        if (moment(selectedDay).isValid()) {
            if (this.state.selectedDates[selectedDay]) {
                // Already in marked dates, so reverse current marked state
                selected = !this.state.selectedDates[selectedDay].selected;
            }
    
            // Create a new object using object property spread since it should be immutable
            // Reading: https://davidwalsh.name/merge-objects
            const updatedSelectedDates = { ...this.state.selectedDates, ...{ [selectedDay]: { selected, selectedColor: SALMON } } };
    
            // Triggers component to render again, picking up the new state
            this.setState({ 
                selectedDates: updatedSelectedDates, 
                markedDates: {...this.state.markedDates, ...updatedSelectedDates}
            });
        }
    };

    componentDidMount() {
        fetch("https://foodu-api.herokuapp.com/api/v1/bookings")
        .then(response => response.json())
        .then(bookings => {
            let markedDates = bookings
                .filter(x => x.foodtruck_auth_id == auth.currentUser.uid);

            markedDates.sort(function compare(a, b) {
                var dateA = new Date(a.date);
                var dateB = new Date(b.date);
                return dateA - dateB;
            });
            
            let result = markedDates.map(b => {
                return {
                    [b.date]: { 
                        selected: false, 
                        marked: true, 
                        selectedColor: SALMON 
                    }
                }
            })
            .reduce((a,e) => {
                return {
                    ...a, 
                    ...{ 
                        [`"${moment(Object.keys(e)[0]).format("YYYY-MM-DD")}"`]: { 
                            marked: true, 
                            dotColor: SALMON
                        } 
                    }
                }
            }, {})

            this.setState({ 
                markedDates: result, 
                ready: true 
            })
        })
    }
    
    render() {
        return (
            <View style={styles.container}>
                {this.state.ready && 
                <View style={styles.container}>
                    <Calendar 
                        markedDates={this.state.markedDates}
                        theme={{
                            textDayFontFamily: 'montserrat',
                            textMonthFontFamily: 'montserrat',
                            textDayHeaderFontFamily: 'montserrat',
                        }}
                        onDayPress={this.markDate}
                    ></Calendar>
                    <View style={styles.submitContainer}>
                        <TouchableHighlight style={ styles.submitButton } onPress={() => this.createBooking()}>
                            <Text style={ styles.submitText }>Add to Schedule</Text>
                        </TouchableHighlight>
                    </View>
                </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#ffffff'
    },
    submitContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingTop: 35
    },
    submitButton: {
        backgroundColor: SALMON,
    },
    submitText: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'montserrat',
        color: '#ffffff',
        lineHeight: 40
    }
});