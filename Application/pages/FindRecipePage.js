import React, { Component } from 'react';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from './Functions/NotificationManager.js';
import rf from "./Functions/RecipeFunctions";
import { ScrollView, StyleSheet } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';

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
    return (
      <React.Fragment>
        <ScrollView style={styles.card}>
          {
            this.state.recipes.map((aRecipe) => {
              {
                if ({ aRecipe }) {
                  return (
                    <Card key={"Key: " + aRecipe.title}>
                      <CardImage
                        source={{ uri: aRecipe.image }}
                      // title="Top 10 South African beaches"
                      />
                      <CardTitle
                        subtitle={aRecipe.title}
                      />
                      <CardContent text={"Serves " + aRecipe.servings + "\t\t\tReady in  " + aRecipe.readyInMinutes + " minutes"} />
                      <CardAction
                        separator={true}
                        inColumn={false}>
                        <CardButton
                          onPress={() => { }}
                          title="Share"
                          color="#FEB557"
                        />
                        <CardButton
                          onPress={() => {
                            this.props.navigation.navigate("RecipeDetailsPage", {
                              url: aRecipe.spoonacularSourceUrl
                            })
                          }}
                          title="Details"
                          color="#FEB557"
                        />
                      </CardAction>
                    </Card>
                  );
                }
              }
            })
          }
        </ScrollView>
        <NotificationPopup ref={ref => this.popup = ref} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white'
  }
});
