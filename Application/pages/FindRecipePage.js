import React, { Component } from 'react';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from './Functions/NotificationManager.js';
import rf from "./Functions/RecipeFunctions";
import { FlatList, StyleSheet, Image } from 'react-native';
import { Layout, TopNavigation, TopNavigationAction, Card, Text, Button } from '@ui-kitten/components';
import { dark, light } from '../assets/Themes.js';
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

    const Header = (imageSource, title) => (
      <React.Fragment>
        <Image
          style={styles.headerImage}
          source={{ uri: imageSource }}
        />
        <Text
          style={styles.headerText}
          category='h5'>
          {title}
        </Text>
      </React.Fragment>
    );

    const Footer = (onSharePress, onDetailsPress) => (
      <Layout style={styles.footerContainer}>
        <Layout style={styles.cardButtonGroup} >
          <Button
            style={styles.cardButtonLeft}
            status='basic'
            onPress={onSharePress}
          >
            {"SHARE"}
          </Button>
          <Button
            style={styles.cardButtonRight}
            onPress={onDetailsPress}
          >
            {"DETAILS"}
          </Button>
        </Layout>
      </Layout>
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
            style={{ backgroundColor: global.theme == light ? light["background-basic-color-1"] : dark["background-basic-color-1"] }}
            data={this.state.recipes}
            width="100%"
            keyExtractor={(item, index) => item.title}
            renderItem={({ item }) => {
              return (
                <Layout style={styles.cardContainer}>
                  <Card
                    style={styles.card}
                    appearance='filled'
                    header={() => Header(item.image, item.title)}
                    footer={() => Footer(
                      () => {
                        this.props.navigation.navigate("YourContacts", {
                          share: true,
                          recipeName: item.title,
                          recipeUrl: item.spoonacularSourceUrl,
                          ingredients: item.extendedIngredients
                        })
                      },
                      () => {
                        this.props.navigation.navigate("RecipeDetailsPage", {
                          url: item.spoonacularSourceUrl,
                          ingredients: item.extendedIngredients,
                          name: item.title
                        })
                      })}>
                    <Text>
                      {"Serves " + item.servings + "\t\t\tReady in " + item.readyInMinutes + " minutes"}
                    </Text>
                  </Card>
                </Layout>
              );
            }}
          />}
        <NotificationPopup ref={ref => this.popup = ref} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: .80,
    shadowOffset: { width: 0, height: 0, },
    backgroundColor: "#0000",
    elevation: 6,
  },
  card: {
    flex: 1,
    borderRadius: 20,
  },
  headerImage: {
    flex: 1,
    height: 300,
  },
  headerText: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  footerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  cardButtonLeft: {
    flex: 1,
    padding: 8,
    marginRight: 4,
  },
  cardButtonRight: {
    flex: 1,
    padding: 8,
    marginLeft: 4,
  },
});
