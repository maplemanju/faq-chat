import smoothscroll from 'smoothscroll-polyfill';
import React from 'react';
import './index.css';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import BotStrings from "./BotStrings";
import qAndA from './ChatStrings'

smoothscroll.polyfill();

function Top(props) {
  return (
    <div className="top">
        <div className="avatar">
          <BotStrings needed="headerAvatar" width="40" height="53" />
        </div>
        <span><BotStrings needed="headerTxt"/></span>
    </div>
  );
}

function ChatArea(props) {
  const {loading, chatType, chats, newRef} = props;
  const loader = <span className="loader"></span>;

  let scrollToBottom = (element, behavior) => {
   element.scrollIntoView({behavior: behavior, block: "end"})
  }

  return (
    <div className="chat_area">
    {chats.map((item, i, chat_ar) => {
      const chatter = chatType[i];
      const isLoading = loading && chat_ar.length - 1 === i;
      const chatClass = 'chatter ' + chatter;
      const avatar = chatter === 'support' ? <div className="avatar"><BotStrings needed="chatterAvatar" width="30" height="30" /></div>: '';

      return (
        <div className={chatClass} key={i} ref={chat_ar.length - 1 === i? newRef : null}>
          {avatar}
          <div className="balloon">
            <SwitchTransition>
            <CSSTransition
              key={isLoading}
              classNames="fade"
              onExit={()=>scrollToBottom(newRef.current,"smooth")}
              onEnter={()=>scrollToBottom(newRef.current,"auto")}
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
    })}
    </div>
  ); //return
}

function RepeatButton(props) {
  const btnClass = props.endOfChat ? "repeat_btn ask_repeat" : "repeat_btn";
  return (
    <button className={btnClass} disabled={props.disabled} onClick={() => props.handleClick(-1)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path d="M13.5 2c-5.629 0-10.212 4.436-10.475 10h-3.025l4.537 5.917 4.463-5.917h-2.975c.26-3.902 3.508-7 7.475-7 4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5c-2.381 0-4.502-1.119-5.876-2.854l-1.847 2.449c1.919 2.088 4.664 3.405 7.723 3.405 5.798 0 10.5-4.702 10.5-10.5s-4.702-10.5-10.5-10.5z"/></svg>
      repeat
    </button>
  )
}

export default class ChatBot extends React.Component {
  constructor(props) {
    super(props);
    const data = qAndA;
    this.newMsgref = React.createRef();
    this.state = {
      data: data, // main string data
      selection: data, // current index on the data
      chats: [data.bot], // chat array
      chatType: ["support"], // support or customer
      loading: false, // ellipsis loading
      disableClick: false,
      endOfChat: false
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
  // element.scroll({ top: -10, left: 0, behavior: behavior });
  }  

  choiceList(choices, chosen = -1, disableAll = false) {
    return (
    <div className="choices">
    { choices.map((choice,i) => {
        const chosenClass = i===chosen ? 'chosen' : '';
        return <button key={i} className={chosenClass} disabled={disableAll} onClick={() => this.handleClick(i)}>{choice}</button>
    }) }
    </div>
    )
  }

  disablePastChoices(choice, choices) {
    let { chats } = this.state;
    chats[chats.length - 1] = this.choiceList(choices, choice, true);
    this.setState({
      chats: chats
    });
  }

  handleClick(i) {
    let { chats, selection, chatType } = this.state;

    this.setState({
      disableClick: true,
      endOfChat: false
    });

    if(!this.state.endOfChat) {
      this.disablePastChoices(i, selection.choices);
    }

    if(i<0) {
      selection = this.state.data;
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
          chatType: chatType,
          disableClick: false
        });
        this.scrollToBottom(this.newMsgref.current, "smooth");
      }, 2000);
    } else {
      this.setState({
        disableClick: false,
        endOfChat: true
      });
    }
  }

  render() {
    const {chats, loading, chatType, endOfChat, disableClick} = this.state;
    return (
      <div className="chatbody">
      <Top/>
      <ChatArea chats={chats} loading={loading} chatType={chatType} newRef={this.newMsgref}/>
      <div className="bottom">
        <RepeatButton endOfChat={endOfChat} disabled={disableClick} handleClick={() => this.handleClick(-1)} />
      </div>
      </div>
    );
  }
}
