import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import Footer from "../Components/Footer";
import ScheduleWeekModal from "../Components/ScheduleWeekModal";
import moment from "moment";
import { DARK_GREY, LIGHT_GREY, SALMON, BROWN } from "../constants";
const { width, height } = Dimensions.get("window");

export default class ScheduleDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }

    _onRequestPress = detailUUID => {
        this.props.navigate("BookingDetail", { detailId: detailUUID });
    };

    _onSearchPress = date => {
        this.props.navigate("Map", { searchDate: this.props.date });
    };

    _getDetailSection = () => {
        return this.props.hasRequestedBooking ? this._getRequestedBooking() : this._getSearchSection();
    };
    
    _showModal = visible => {
        this.setState({ modalVisible: visible });
    };

    _getRequestedBooking = () => {
        const { name, address, timeRange } = this.props;
        let abbrName = name.length > 20 ? `${name.substr(0, 18)}...` : name
        return (
            <TouchableOpacity
                onPress={() => this._showModal(!this.state.modalVisible)}
                style={ [styles.containerBox, styles.venueInfoContainer]}>
                <View style={ styles.topBar }></View>
                <Image style={ styles.venueImage } source={require("../Images/venue-img.png")} />
                <View style={styles.venueTextContainer}>
                    <Text style={styles.venueInfoHeader}>{abbrName}</Text>
                    <Text style={styles.venueInfoText}>{address}</Text>
                    <Text style={styles.venueInfoText}>{timeRange}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    _getSearchSection = () => {
        return (
            <TouchableOpacity onPress={this._onSearchPress}>
                <View style={styles.containerBox}>
                    <Text style={styles.detailText}>Search</Text>
                    <View style={styles.searchImageContainer}>
                        <Image source={require("../Images/magnifying-glass.png")} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.dateText}>
                    {moment(this.props.date).format("ddd D YYYY")}
                </Text>
                {this._getDetailSection()}
                {this.state.modalVisible && (
                    <ScheduleWeekModal
                        setModalVisible={this._showModal}
                        modalVisible={this.state.modalVisible}
                        {...this.props}
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "stretch",
        padding: 20,
        backgroundColor: "#ffffff"
    },
    containerBox: {
        overflow: "hidden",
        borderRadius: 120 * 0.1,
        height: 120,
        backgroundColor: LIGHT_GREY,
        justifyContent: "center",
        alignItems: "center"
    },
    topBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 10,
        backgroundColor: "#D7D7D7"
    },
    venueImage: {
        height: 67,
        width: 67,
        borderRadius: 67,
        margin: 21
    },
    venueTextContainer: {
        justifyContent: 'center'
    },
    venueInfoHeader: {
        color: BROWN,
        fontSize: 16,
        fontFamily: "montserrat"
    },
    venueInfoText: {
        color: "#999",
        fontSize: 12,
        fontFamily: "roboto"
    },
    venueInfoContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    searchImageContainer: {
        width: 42,
        height: 42,
        borderRadius: 42 * 0.1,
        backgroundColor: "#D7D7D7",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 50
    },
    dateText: {
        marginTop: 20,
        marginBottom: 10,
        fontFamily: "montserrat",
        fontSize: 18,
        color: SALMON
    },
    timeText: {
        color: "#888",
        fontSize: 16,
        fontFamily: "montserrat",
        marginTop: 20,
        marginRight: 5,
        marginBottom: 10,
        marginLeft: 10
    },
    detailText: {
        fontSize: 18,
        fontFamily: "montserrat"
    }
});
