import React, { Component } from "react";
import { Text, View, FlatList, Alert } from "react-native";
import styles from "./pageStyles/YourListsPageStyle";

class YourLists extends Component {
  constructor(props) {
    super(props);
    this.lists = [
      {
        title: "List One"
      },
      {
        title: "List Two"
      },
      {
        title: "List Three"
      }
    ];
    this.state = {
      listHolder: []
    };
  }

  componentDidMount() {
    this.setState({ arrayHolder: [...this.lists] });
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
      <View style={styles.MainContainer}>
        <FlatList
          data={this.state.arrayHolder}
          width="100%"
          extraData={this.state.arrayHolder}
          keyExtractor={index => index.toString()}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item }) => (
            <Text
              style={styles.item}
              onPress={this.GetItem.bind(this, item.title)}
            >
              {" "}
              {item.title}{" "}
            </Text>
          )}
        />
      </View>
    );
  }
}

export default YourLists;
