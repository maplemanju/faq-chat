# Greetings!

This is rule-based chat bot created in React.\
See the sample on https://faq-chat.amayadori.cloud/

# Customizing

## Icon

To change the icons, replace the images on `./images/`
header-avatar.png for the header icon and\
chatter-avatar.png for the icon beside the chat balloon.

## Theme colors

On the index.css file, change the declared colors variables on root.


## Chat question and answer strings

The strings are on the `./ChatStrings.json` file.\
**bot** key is the script for the bot's chat.\
**choices** key contains an array for the choices after corresponding bot key\
**sub** key is an array of objects containing the next bot-choices after the selection on `choices`. 

Choices and Sub will always have the same length, if not, some selection will produce null answers.

sample:

```
{
  "bot": "First prompt to show up",
  "choices": [
    "question1 here",
    "question2 here"
  ],
  "sub": [
    {
      "bot": "you chose question1: here are your choices",
      "choices": [
        "choice1",
        "choice2"
      ],
      "sub": [... two objects here for two choices]
    },
    {
      "bot": "you chose question2: no more choices here"
    },
  ]
}
```

=====================


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


