import React from "react";
import { StyleSheet, Text, Image, View, TouchableHighlight } from "react-native";
import { SALMON, BROWN } from "../constants";

const MapViewCallout = props => {
  return (
    <View style={styles.container}>
      <View style={styles.venueContainer}>
        <Image style={styles.venueImage} source={require("../Images/venue-img-square.png")} />
        <View style={styles.venueInfoContainer}>
          <Text style={styles.venueInfoHeader}>{props.marker.title}</Text>
          <Text style={styles.venueInfoText}>{props.marker.description}</Text>
        </View>
      </View>
      <TouchableHighlight style={styles.request} onPress={() => props.requestBooking()}>
        <View style={styles.requestTextContainer}>
          <Text style={styles.requestText}>Request</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: 81,
    position: "absolute",
    left: 0,
    right: 0, 
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center'
  },
  venueContainer: {
    flexDirection: 'row'
  },
  venueImage: {
    height: 81,
    width: 81,
    marginRight: 14
  },
  venueInfoContainer: {
    justifyContent: 'center'
  },
  venueInfoHeader: {
      color: BROWN, 
      fontSize: 16, 
      fontFamily: 'montserrat' 
  },
  venueInfoText: {
      color: '#999', 
      fontSize: 12, 
      fontFamily: 'roboto' 
  },
  request: {
    height: 81,
    width: 81,
    backgroundColor: SALMON,
    justifyContent: 'center',
    alignItems: 'center'
  },
  requestTextContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  requestText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: 'montserrat'
  }
});

export default MapViewCallout;
