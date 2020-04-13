import React from 'react';
import {Body, Text, Card, CardItem, Image, View, Fab, Icon, Button, Left, Right,Thumbnail} from 'native-base';

import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

export default function EventBox(props) {
  let { event, isClickable } = props;
  const navigation = useNavigation();

  let color = 'black';
  const today = new Date().getTime() / 1000;
  const oneday = 60 * 24 * 60;
  if (event.startAt - today > 7 * oneday) color = 'green';
  else if (event.startAt - today < oneday) color = 'red';
  // else if (event.startAt - newDate().getTime() < 7 * 60 * 24) setColor('green');

  return (
    <Card key={event.id} >
      <CardItem style={{ padding: 1, backgroundColor: color }}></CardItem>
      <CardItem
        button
        onPress={() => {
          if (isClickable) navigation.navigate('Event', { event });
        }}
      >
        <Body >
            {/*<Thumbnail square large source={{uri: 'https://i.imgur.com/TkIrScD.png'}}  />*/}
            <CardItem cardBody>
                <Thumbnail large square source={{uri: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-blurred-sunset-sky-and-ocean-irina-moskalev.jpg'}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <Text style={{ fontWeight: 'bold',fontSize: 20 }}>{event.title}</Text>
          <Text style={{ marginTop: 5 }}>{event.description}</Text>
          {/*<Text style={{ marginTop: 5 }}>{event.image}</Text>*/}
            <Text style={{ marginTop: 5 }}>{moment.unix(event.startAt).format('MM/DD/YYYY h:mm a')}</Text>

        </Body>
      </CardItem>
        <CardItem>
            <Left>
                <Button transparent onPress={() =>{alert("TODO")}}>
                    <Icon active name="share" />
                </Button>
                <Button transparent onPress={() =>{alert("TODO")}}>
                    <Icon active name="logo-facebook" />

                </Button>
            </Left>
        </CardItem>
    </Card>
  );
}

const styles = {
    thumbnail: {
        width: 300,
        height: 110,
        resizeMode: 'cover',
    },
    textFont: {
        fontSize: 20,
    },
};