import React from 'react';
import {
  Container,
  Header,
  Body,
  Button,
  Left,
  Right,
  Title,
  Text,
  Content,
  Card,
  CardItem, Icon
} from 'native-base';

export default function({ navigation }) {
  return (
    <Container>
      <Header>
        <Left/>
        <Body>
          <Title>About</Title>
        </Body>
        <Right>

        </Right>
      </Header>
      <Content>
        <Card transparent>
          <CardItem>
            <Body>
              <Text>About the app!</Text>
            </Body>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
}
