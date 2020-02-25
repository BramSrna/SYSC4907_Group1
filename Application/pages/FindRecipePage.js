import React, { Component } from 'react';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from './Functions/NotificationManager.js';
import rf from "./Functions/RecipeFunctions";
import { FlatList, StyleSheet } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { TopNavigation, TopNavigationAction, } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";

export default class FindRecipePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };
    rf.GetRandomRecipesFromDatabase(this);
  }

  componentWillMount() {
    this.focusListener = this.props.navigation.addListener(
      "willFocus",
      () => {
        nm.setThat(this)
        this._isMounted = true;
      }
    );
  }

  componentWillUnmount() {
    this.focusListener.remove()
    this._isMounted = false;
  }

  render() {
    const renderMenuAction = () => (
      <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
    );
    return (
      <React.Fragment>
        <TopNavigation
          title="Find a Recipe"
          alignment='center'
          leftControl={renderMenuAction()}
        />
        {this.state.recipes.length > 0 &&
          <FlatList
            contentContainerStyle={{ paddingBottom: 16 }}
            style={styles.flatList}
            data={this.state.recipes}
            width="100%"
            keyExtractor={(item, index) => item.title}
            renderItem={({ item }) => {
              return (
                <Card style={styles.card} key={"Key: " + item.title}>
                  <CardImage
                    source={{ uri: item.image }}
                  />
                  <CardTitle
                    subtitle={item.title}
                  />
                  <CardContent text={"Serves " + item.servings + "\t\t\tReady in  " + item.readyInMinutes + " minutes"} />
                  <CardAction
                    separator={true}
                    inColumn={false}>
                    <CardButton
                      onPress={() => {
                        this.props.navigation.navigate("YourContacts", {
                          share: true,
                          recipeName: item.title,
                          recipeUrl: item.spoonacularSourceUrl
                        })
                      }}
                      title="Share"
                      color="#FEB557"
                    />
                    <CardButton
                      onPress={() => {
                        this.props.navigation.navigate("RecipeDetailsPage", {
                          url: item.spoonacularSourceUrl,
                          ingredients: item.extendedIngredients
                        })
                      }}
                      title="Details"
                      color="#FEB557"
                    />
                  </CardAction>
                </Card>
              );
            }}
          />}
        <NotificationPopup ref={ref => this.popup = ref} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  card: {

  }
});
