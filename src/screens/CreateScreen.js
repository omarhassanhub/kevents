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

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });

  };

  if (selectedImage !== null) {
    // console.log("******")
    // console.log(selectedImage.localUri)
    // alert(selectedImage.localUri)
    const test = selectedImage.localUri;
    const lastStr = test.lastIndexOf("/");
    const str = test.substring(lastStr + 1);
    const extension = str.split(".")[1]
    const text = str.substring(0, str.lastIndexOf('.'));
    // console.log("+++++");
    // console.log(str);
    console.log(extension);
    console.log(text);
  }

  const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
  } = config
  // upload the image to S3 and then save it in the GraphQL API
  // async function createProduct() {
  //
  //   if (selectedImage) {
  //     const getImageUri = selectedImage.localUri;
  //     const lastStr = getImageUri.lastIndexOf("/");
  //     const str = getImageUri.substring(lastStr + 1);
  //     const extension = str.split(".")[1]
  //     const fileName = str.substring(0, str.lastIndexOf('.'));
  //     // const extension = x.split(".")[1]
  //     const { type: mimeType } = fileName
  //     const key = `images/${uuid()}${fileName}.${extension}`
  //     const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`
  //
  //     const inputData = { name: fileName , image: url }
  //
  //     try {
  //       await Storage.put(key, fileName, {
  //         contentType: mimeType
  //       })
  //       await API.graphql(graphqlOperation(CreateProduct, { input: inputData }))
  //     } catch (err) {
  //       console.log('error: ', err)
  //     }
  //   }
  // }


  let user = getCognitoUser();
  const { attributes } = user;

  let title = useFormInput();
  let description = useFormInput();
  let image = useFormInput();

  const createNewEvent = async () => {
    if (!title.value || !description.value) {
      alert('Please fill out all the fields');
      return;
    }
    // if (selectedImage) {
      const getImageUri = selectedImage.localUri;
      const lastStr = getImageUri.lastIndexOf("/");
      const str = getImageUri.substring(lastStr + 1);
      const extension = str.split(".")[1]
      const fileName = str.substring(0, str.lastIndexOf('.'));
      // const extension = x.split(".")[1]

      let contentType = 'application/octet-stream';


      const key = `images/${uuid()}${fileName}.${extension}`
      const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`

      if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif')
          contentType = "image/" + extension;
      const { type: mimeType } = contentType
      const inputData = { name: fileName , image: url }

      // try {
      //   await Storage.put(key, fileName, {
      //     contentType: mimeType
      //   })
      //   await API.graphql(graphqlOperation(CreateProduct, { input: inputData }))
      // } catch (err) {
      //   console.log('error: ', err)
      // }
    // }
    const input = {
      input: {
        startAt: Date.parse(datetime) / 1000,
        title: title.value,
        description: description.value,
        image: url,
        eventUserId: attributes.sub,
        status: 'CREATED',
      },
    };

    let result = null;
    try {
        await Storage.put(key, fileName, {
          contentType: "image/jpg"
        })
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
            <Button onPress={openImagePickerAsync}><Text>Select Poster</Text></Button>


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
