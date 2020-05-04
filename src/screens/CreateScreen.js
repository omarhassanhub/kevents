import React, { useState, useEffect } from 'react';
import {
  Container,
  Item,
  Input,
  Body,
  Content,
  Button,
  Text,
  Label,
  Header,
  Left,
  Right,
  Title,
  Form,
  View,
  Image, Thumbnail,
} from 'native-base';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

import moment from 'moment';

import { getCognitoUser } from '../utils/users';
import { useFormInput } from '../utils/forms';

import { Storage, API, graphqlOperation } from 'aws-amplify';
import uuid from 'uuid/v4'
import config from '../../aws-exports'
import Analytics from '@aws-amplify/analytics';
import { createEvent } from '../graphql/mutations';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
export default function CreateScreen({ navigation }) {

  const [datetime, setDatetime] = useState();
  const [mode, setMode] = useState('datetime');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (datetime) => {
    setDatetime(datetime);
    hideDatePicker();
  };


  let [selectedImage, setSelectedImage] = React.useState(null);

  const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
  } = config


  let user = getCognitoUser();
  const { attributes } = user;
  console.log(attributes)

  let title = useFormInput();
  let description = useFormInput();
  let social_url = useFormInput();
  let image = useFormInput();

  // event handler to pull up camera roll
  const _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        aspect: [4, 3],
      });
      // await _handleImagePicked(pickerResult);
      setSelectedImage({ uri: pickerResult.uri });
    }
  };


  const createNewEvent = async () => {
    if (!title.value || !description.value) {
      alert('Please fill out all the fields');
      return;
    }

    const imageName = selectedImage.uri.replace(/^.*[\\\/]/, '');
    // const fileType = mime.lookup(pickerResult.uri);
    const access = { contentType: 'image/jpeg' };
    const imageData = await fetch(selectedImage.uri)
    const blobData = await imageData.blob()
    const key = `images/${imageName}`
    const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`

      // if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif')
      //     contentType = "image/" + extension;
    const input = {
      input: {
        startAt: Date.parse(datetime) / 1000,
        title: title.value,
        description: description.value,
        image: url,
        social_url: social_url.value,
        eventUserId: attributes.sub,
        status: 'CREATED',
      },
    };

    let result = null;
    try {
      await Storage.put(key, blobData, access)
          .then (result => console.log(result))
          .catch(err => console.log(err));
      result = await API.graphql(graphqlOperation(createEvent, input));
    } catch (e) {
      console.log(e);
    }

    navigation.navigate('Home', { refreshList: true });

    await Analytics.updateEndpoint({
      userAttributes: {
        latestEvent: [title.value],
      },
    }).then(() => {
      console.log('createdEvent');
      Analytics.record({
        name: 'createdEvent',
        attributes: {
          username: user.username,
          userId: user.attributes.sub,
        },
      });
    });

    return result.data;
  };


  return (
    <Container>
      <Header>
        <Left />
        <Body>
          <Title>Home</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => navigation.goBack()}>
            <Text>Close</Text>
          </Button>
        </Right>
      </Header>
      <Content>
        <Form>
          <Item fixedLabel>
            <Label>Title</Label>
            <Input {...title} />
          </Item>
          <Item fixedLabel>
            <Label>Description</Label>
            <Input {...description} />
          </Item>
          <Item fixedLabel>
            <Label>Poster</Label>
            {/*<Input {...image} />*/}
            <Button onPress={_pickImage}><Text>Select Poster</Text></Button>
          </Item>
          <Item fixedLabel>
            <Label>Social Media Url</Label>
            <Input {...social_url} />
          </Item>
          <Item fixedLabel last>
            <Label>Date & Time</Label>
            <Input
              onFocus={() => showDatePicker()}
              value={moment(datetime).calendar()}
            />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode={mode}
              datetime={datetime}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </Item>
        </Form>

        <Button full onPress={() => createNewEvent()}>
          <Text>Save</Text>
        </Button>
      </Content>
    </Container>
  );
}
