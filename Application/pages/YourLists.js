import React, { Component } from "react";
import { Text, View, FlatList, Alert, BackHandler } from "react-native";
import styles from "./pageStyles/YourListsPageStyle";

/**
 *  TODO
 On this page we will need to get all the titles and actual items that the user is a part of. We will need the Cloud API to do this. For now I have hardcoded data to move on but I will need to come back to this once the Cloud is all setup.
 */

class YourLists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listTitles: [],
      apiData: []
    };
  }

  componentDidMount() {
    // Im guessing this is something similar to what the Firebase query will return
    this.setState(
      {
        apiData: [
          { name: "List One", items: ["Item1", "Item2"] },
          { name: "List Two", items: ["Item1", "Item2", "Item3"] }
        ]
      },
      function() {
        this.GenerateListTitlesFromApiData();
      }
    );
    BackHandler.addEventListener("hardwareBackPress", function() {
      // Return true if you want to go back, false if want to ignore. This is for Android only.
      // return true;
      return false;
    });
  }

  GenerateListTitlesFromApiData() {
    var data = this.state.apiData;
    var tempNames = [];
    for (var list in data) {
      tempNames.push(data[list].name);
    }
    this.setState({ listTitles: tempNames });
  }

  GenerateListItemsFromApiData(listName) {
    var data = this.state.apiData;
    var tempList = [];
    for (var list in data) {
      if (data[list].name == listName) {
        tempList = data[list].items;
      }
    }
    return tempList;
  }

  /**
   * TODO
   Should we pass in all the API data, so that way if they return to the page we don't have to make another API call.
   Pro: Less API call --> Faster? Save data?
   Con: Passing in a lot of useless info to another page --> Slower?
   */
  GoToList(item) {
    this.props.navigation.navigate("Current List", {
      name: item,
      list: this.GenerateListItemsFromApiData(item)
    });
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
            <Text style={styles.item} onPress={this.GoToList.bind(this, item)}>
              {item}
            </Text>
          )}
        />
      </View>
    );
  }
}

export default YourLists;
