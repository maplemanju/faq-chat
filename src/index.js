import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { SwitchTransition, CSSTransition } from 'react-transition-group';
import qAndA from './qa_scripts/default.json'


function Top(props) {
  return (
    <div className="top">
        <div className="avatar">
          {botIdendity.avatar}
        </div>
        <span>{botIdendity.headerTxt}</span>
    </div>
  );
}

class ChatArea extends React.Component {
  constructor(props) {
    super(props)
   // this.newMsgref = React.createRef()
  }

  scrollToBottom(element, behavior) {
    element.scrollIntoView({behavior: behavior, block: "end"});
  }  

  render() {
    const loader = <span className="loader"></span>;
    const {loading, chatType, newRef, chats} = this.props;
    
    return (
      <div className="chat_area">
      {chats.map((item,i, chat_ar) => {
        const chatter = chatType[i];
        const isLoading = loading && chat_ar.length - 1 === i;
        const chatClass = 'chatter ' + chatter;
        const avatar = chatter === 'support' ? <div className="avatar">{botIdendity.avatar}</div>: '';

        return (
          <div className={chatClass} key={i} ref={chat_ar.length - 1 === i? newRef : ''}>
            {avatar}
            <div className="balloon">
              <SwitchTransition>
              <CSSTransition
                key={isLoading}
                classNames="fade"
                onExit={() => this.scrollToBottom(newRef.current, "smooth")}
                onEnter={() => this.scrollToBottom(newRef.current, "auto")}
                addEndListener={(node, done) => {
                node.addEventListener("transitionend", done, false);
              }}>
              <div>
                { isLoading ? loader : item }
              </div>
              </CSSTransition>
              </SwitchTransition>
            </div>
          </div>
        );
      }).reverse()}
      </div>
    ); //return
  } //render
}

const botIdendity = {
  avatar: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 3c5.514 0 10 3.592 10 8.007 0 4.917-5.145 7.961-9.91 7.961-1.937 0-3.383-.397-4.394-.644-1 .613-1.595 1.037-4.272 1.82.535-1.373.723-2.748.602-4.265-.838-1-2.025-2.4-2.025-4.872-.001-4.415 4.485-8.007 9.999-8.007zm0-2c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.418.345 2.775.503 4.059.503 7.084 0 11.91-4.837 11.91-9.961-.001-5.811-5.702-10.006-12.001-10.006zm1.024 13.975c0 .566-.458 1.025-1.024 1.025-.565 0-1.024-.459-1.024-1.025 0-.565.459-1.024 1.024-1.024.566 0 1.024.459 1.024 1.024zm1.141-8.192c-.498-.505-1.241-.783-2.09-.783-1.786 0-2.941 1.271-2.941 3.237h1.647c0-1.217.68-1.649 1.261-1.649.519 0 1.07.345 1.117 1.004.052.694-.319 1.046-.788 1.493-1.157 1.1-1.179 1.633-1.173 2.842h1.643c-.01-.544.025-.986.766-1.785.555-.598 1.245-1.342 1.259-2.477.008-.758-.233-1.409-.701-1.882z"/></svg>,
  headerTxt: 'Support'
}

class ChatBot extends React.Component {
  constructor(props) {
    super(props);
    this.newMsgref = React.createRef();
    this.state = {
      selection: qAndA, //current index on json
      chats: [qAndA.bot], // chat array
      chatType: ["support"], // support or customer
      loading: false, // ellipsis loading
    };
  }

  componentDidMount() {
    this.scrollToBottom(this.newMsgref.current, "auto");
    this.state.chats.push(this.choiceList(this.state.selection.choices));
    this.state.chatType.push('customer');
    setTimeout(() => {
      this.setState({
        chats: this.state.chats,
        chatType: this.state.chatType,
      });
     this.scrollToBottom(this.newMsgref.current, "smooth");
    }, 600);
  }

  scrollToBottom(element, behavior) {
    element.scrollIntoView({behavior: behavior, block: "end"});
  }  

  choiceList(choices) {
    return (
    <ul className="choices">
    { choices.map((choice,i) => {
        return <li key={i} onClick={() => this.handleClick(i)}>{choice}</li>
    }) }
    </ul>
    )
  }

  handleClick(i) {
    let { chats, selection, chatType } = this.state;
    if(i<0) {
      selection = qAndA;
    } else {
      selection = selection.sub[i];
    }

    //push bot chat
    chats.push(selection.bot);
    chatType.push('support');
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({
        selection: selection,
        chats: chats,
        loading: false,
        chatType: chatType
      });
    }, 300);

    //push choices chat
    if (selection.choices) {
      setTimeout(() => {
        chatType.push('customer');
        chats.push(this.choiceList(selection.choices));
        this.setState({
          chats: chats,
          chatType: chatType
        });
        this.scrollToBottom(this.newMsgref.current, "smooth");
      }, 2000);
    } else {
      //
    }
  }
  
  render() {
    const {chats, loading, chatType} = this.state;
    
    return (
      <div className="chatbody">
      <Top/>
      <ChatArea chats={chats} loading={loading} chatType={chatType} newRef={this.newMsgref}/>
      <div className="bottom">
        <button class="repeat_btn" onClick={() => this.handleClick(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path d="M13.5 2c-5.629 0-10.212 4.436-10.475 10h-3.025l4.537 5.917 4.463-5.917h-2.975c.26-3.902 3.508-7 7.475-7 4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5c-2.381 0-4.502-1.119-5.876-2.854l-1.847 2.449c1.919 2.088 4.664 3.405 7.723 3.405 5.798 0 10.5-4.702 10.5-10.5s-4.702-10.5-10.5-10.5z"/></svg>
          repeat
        </button>
      </div>
      </div>
    );
  }
}

// ====================================


ReactDOM.render(<ChatBot />,document.getElementById('root'));

