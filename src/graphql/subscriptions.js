/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      name
      email
      phone_number
      username
      events {
        items {
          id
          title
          description
          image
          social_url
          status
          startAt
          owner
        }
        nextToken
      }
      chats {
        items {
          id
          content
          createdAt
        }
        nextToken
      }
      followers {
        items {
          id
        }
        nextToken
      }
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      name
      email
      phone_number
      username
      events {
        items {
          id
          title
          description
          image
          social_url
          status
          startAt
          owner
        }
        nextToken
      }
      chats {
        items {
          id
          content
          createdAt
        }
        nextToken
      }
      followers {
        items {
          id
        }
        nextToken
      }
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      name
      email
      phone_number
      username
      events {
        items {
          id
          title
          description
          image
          social_url
          status
          startAt
          owner
        }
        nextToken
      }
      chats {
        items {
          id
          content
          createdAt
        }
        nextToken
      }
      followers {
        items {
          id
        }
        nextToken
      }
    }
  }
`;
export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent($owner: String) {
    onCreateEvent(owner: $owner) {
      id
      title
      description
      image
      social_url
      status
      user {
        id
        name
        email
        phone_number
        username
        events {
          nextToken
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
      }
      chats {
        items {
          id
          content
          createdAt
        }
        nextToken
      }
      followers {
        items {
          id
        }
        nextToken
      }
      startAt
      owner
    }
  }
`;
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent($owner: String) {
    onUpdateEvent(owner: $owner) {
      id
      title
      description
      image
      social_url
      status
      user {
        id
        name
        email
        phone_number
        username
        events {
          nextToken
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
      }
      chats {
        items {
          id
          content
          createdAt
        }
        nextToken
      }
      followers {
        items {
          id
        }
        nextToken
      }
      startAt
      owner
    }
  }
`;
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent($owner: String) {
    onDeleteEvent(owner: $owner) {
      id
      title
      description
      image
      social_url
      status
      user {
        id
        name
        email
        phone_number
        username
        events {
          nextToken
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
      }
      chats {
        items {
          id
          content
          createdAt
        }
        nextToken
      }
      followers {
        items {
          id
        }
        nextToken
      }
      startAt
      owner
    }
  }
`;
export const onCreateChat = /* GraphQL */ `
  subscription OnCreateChat {
    onCreateChat {
      id
      content
      user {
        id
        name
        email
        phone_number
        username
        events {
          nextToken
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
      }
      event {
        id
        title
        description
        image
        social_url
        status
        user {
          id
          name
          email
          phone_number
          username
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
        startAt
        owner
      }
      createdAt
    }
  }
`;
export const onUpdateChat = /* GraphQL */ `
  subscription OnUpdateChat {
    onUpdateChat {
      id
      content
      user {
        id
        name
        email
        phone_number
        username
        events {
          nextToken
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
      }
      event {
        id
        title
        description
        image
        social_url
        status
        user {
          id
          name
          email
          phone_number
          username
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
        startAt
        owner
      }
      createdAt
    }
  }
`;
export const onDeleteChat = /* GraphQL */ `
  subscription OnDeleteChat {
    onDeleteChat {
      id
      content
      user {
        id
        name
        email
        phone_number
        username
        events {
          nextToken
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
      }
      event {
        id
        title
        description
        image
        social_url
        status
        user {
          id
          name
          email
          phone_number
          username
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
        startAt
        owner
      }
      createdAt
    }
  }
`;
export const onCreateFollower = /* GraphQL */ `
  subscription OnCreateFollower {
    onCreateFollower {
      id
      user {
        id
        name
        email
        phone_number
        username
        events {
          nextToken
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
      }
      event {
        id
        title
        description
        image
        social_url
        status
        user {
          id
          name
          email
          phone_number
          username
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
        startAt
        owner
      }
    }
  }
`;
export const onUpdateFollower = /* GraphQL */ `
  subscription OnUpdateFollower {
    onUpdateFollower {
      id
      user {
        id
        name
        email
        phone_number
        username
        events {
          nextToken
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
      }
      event {
        id
        title
        description
        image
        social_url
        status
        user {
          id
          name
          email
          phone_number
          username
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
        startAt
        owner
      }
    }
  }
`;
export const onDeleteFollower = /* GraphQL */ `
  subscription OnDeleteFollower {
    onDeleteFollower {
      id
      user {
        id
        name
        email
        phone_number
        username
        events {
          nextToken
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
      }
      event {
        id
        title
        description
        image
        social_url
        status
        user {
          id
          name
          email
          phone_number
          username
        }
        chats {
          nextToken
        }
        followers {
          nextToken
        }
        startAt
        owner
      }
    }
  }
`;
