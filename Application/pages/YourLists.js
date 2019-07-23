import React, { Component } from "react";
import { Text, View, FlatList, Alert } from "react-native";
import styles from "./pageStyles/YourListsPageStyle";

class YourLists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listTitles: []
    };
  }

  componentDidMount() {
    this.setState({ listTitles: ["List One", "List Two", "List Three"] });
  }

  GetItem(item) {
    Alert.alert(item);
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B"
        }}
      />
    );
  };

  render() {
    return (
      <View style={styles.ListContainer}>
        <Text style={styles.pageTitle}>
          Your Lists: {this.state.listTitles.length}
        </Text>
        <FlatList
          style={styles.flatList}
          data={this.state.listTitles}
          width="100%"
          extraData={this.state.arrayHolder}
          keyExtractor={index => index.toString()}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item }) => (
            <Text style={styles.item} onPress={this.GetItem.bind(this, item)}>
              {item}
            </Text>
          )}
        />
      </View>
    );
  }
}

export default YourLists;
