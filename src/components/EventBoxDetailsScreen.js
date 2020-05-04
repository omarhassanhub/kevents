import React, {useState} from 'react';
import {
    Body,
    Text,
    Card,
    CardItem,
    Image,
    View,
    Fab,
    Icon,
    Input,
    Button,
    Left,
    Right,
    Thumbnail,
    Content, Spinner, Label, Item
} from 'native-base';

import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import {useFormInput} from "../utils/forms";
import {API, graphqlOperation, Storage} from "aws-amplify";
import {createEvent, updateEvent} from "../graphql/mutations";
import Analytics from "@aws-amplify/analytics";
import {getCognitoUser} from "../utils/users";
import {render} from "react-native-web";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import config from "../../aws-exports";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default function EventBoxDetailsScreen(props) {
  let { event, updateE, isClickable } = props;
  // console.log(updateE)

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


  const navigation = useNavigation();
    let user = getCognitoUser();
    const { attributes } = user;
    let title = useFormInput(event ? event.title : '');
    let description = useFormInput(event ? event.description : '');
    let image = useFormInput(event ? event.image : '');
    let social_url = useFormInput(event ? event.social_url : '');
    let id = useFormInput(event ? event.id : '');
  let color = 'black';
  const today = new Date().getTime() / 1000;
  const oneday = 60 * 24 * 60;
  if (event.startAt - today > 7 * oneday) color = 'green';
  else if (event.startAt - today < oneday) color = 'red';
  // else if (event.startAt - newDate().getTime() < 7 * 60 * 24) setColor('green');
  //   console.log("EventBOX")
  //   console.log(event)


    const renderEvents = () => {
        const disabledButton = () => (
            <Content>

                <Button
                    disabled
                    bordered
                    style={{ width: 90, justifyContent: 'center' }}
                >
                    <Text>Update</Text>
                </Button>
            </Content>

        );
        const enabledButton = () => (
            <Content>
                <Button

                    bordered
                    style={{ width: 90, justifyContent: 'right' }}
                    onPress={() => createNewEvent()}
                >
                    <Text>Update</Text>
                </Button>

                {/*{refreshing && <Spinner color='red' />}*/}
            </Content>
        );
        const renderButton = () => {
            if (event.user.username === user.username || updateE)

                return enabledButton();
            return disabledButton();
        };
        return (
            <Content
                style={{
                    alignSelf: 'flex-end',
                    padding: 10,
                    alignContent: 'center',
                }}
            >
                {renderButton()}
            </Content>
        );
    }



    const createNewEvent = async () => {

        const imageName = selectedImage.uri.replace(/^.*[\\\/]/, '');
        // const fileType = mime.lookup(pickerResult.uri);
        const access = { contentType: 'image/jpeg' };
        const imageData = await fetch(selectedImage.uri)
        const blobData = await imageData.blob()
        const key = `images/${imageName}`
        const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`

        const input = {
            input: {
                // startAt: Date.parse(datetime) / 1000,
                id: id.value,
                startAt: Date.parse(datetime) / 1000,
                title: title.value,
                description: description.value,
                image: url,
                social_url: social_url.value,
                eventUserId: attributes.sub,
                status: 'UPDATED',
            },
        };

        let result = null;
        try {
            await Storage.put(key, blobData, access)
                .then (result => console.log(result))
                .catch(err => console.log(err));
            result = await API.graphql(graphqlOperation(updateEvent, input));
        } catch (e) {
            console.log(e);
        }

        navigation.navigate('Home', { refreshList: true });

        await Analytics.updateEndpoint({
            userAttributes: {
                latestEvent: [title.value],
            },
        }).then(() => {
            console.log('updatedEvent');
            Analytics.record({
                name: 'updatedEvent',
                attributes: {
                    username: user.username,
                    userId: user.attributes.sub,
                },
            });
        });

        return result.event;
    };

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
                <Thumbnail large square source={{uri: event.image}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>

            <Item fixedLabel>
                <Label>Title</Label>
                <Input {...title}/>
            </Item>
            <Item fixedLabel>
                <Label>Description</Label>
                <Input {...description}/>
            </Item>
            <Item fixedLabel>
                <Label>Poster</Label>
                <Button bordered onPress={_pickImage}><Text>Update Poster</Text></Button>
            </Item>
            <Item fixedLabel>
                <Label>Social url</Label>
                <Input {...social_url}/>
            </Item>

            <Item fixedLabel last>
                <Label>Date & Time</Label>
                <Input
                    onFocus={() => showDatePicker()}
                    value={moment.unix(event.startAt).format('MM/DD/YYYY h:mm a')}
                />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode={mode}
                    datetime={datetime}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
            </Item>
            {/*<Text style={{ marginTop: 5 }}>{moment.unix(event.startAt).format('MM/DD/YYYY h:mm a')}</Text>*/}

        </Body>
      </CardItem>

        <CardItem>
            <Left/>
                {renderEvents()}
            <Right/>
                {/*<Button transparent onPress={() =>{alert("TODO")}}>*/}
                {/*    <Icon active name="share" />*/}
                {/*</Button>*/}
                {/*<Button transparent onPress={() =>{alert("TODO")}}>*/}
                {/*    <Icon active name="logo-facebook" />*/}

                {/*</Button>*/}
                {/*<Button full onPress={() => createNewEvent()}>*/}
                {/*    <Text>Update</Text>*/}
                {/*</Button>*/}
            {/*</Left>*/}
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