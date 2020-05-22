import React from 'react';
import logo from './logo.svg';
import './App.css';

function Accueil() {
  return (
    <div class="container">
        <h3 class=" text-center">Messaging</h3>
        <div class="messaging">
            <div class="inbox_msg">
                <div class="inbox_people">
                    <div class="headind_srch">
                        <div class="recent_heading">
                            <h4>Recent</h4>
                        </div>
                        <div class="srch_bar">
                            <div class="stylish-input-group">
                                <input type="text" class="search-bar"  placeholder="Search" ></input>
                                <span class="input-group-addon">
                                <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                                </span> 
                            </div>
                        </div>
                    </div>
                    
                    <div class="inbox_chat">
                        @foreach($contacts as $contact)
                        @if($contact->id != $user->id)
                        <a href="{{route('message.show',$contact->id)}}">
                            <div class="chat_list active_chat">
                                <div class="chat_people">
                                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"></div>
                                <div class="chat_ib">
                                    <h5>{{$contact->name}} <span class="chat_date">NEW : ()</span></h5>
                                    <p>{{$contact->email}}</p>
                                </div>
                                </div>
                            </div>
                        </a>
                        @endif
                        @endforeach
                    </div>
                
            </div>
            <div class="mesgs">
                <div class="msg_history">
                @if(isset($messages))
                @foreach($messages as $message)
                @if($message->id_receiver == $user->id && $message->content != '')
                <div class="incoming_msg">
                    <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                    <div class="received_msg">
                    <div class="received_withd_msg">
                        <p>{{$message->content}}</p>
                        <span class="time_date">{{$message->created_at}}</span></div>
                    </div>
                </div>
                @elseif($message->id_sender == $user->id && $message->content != '')
                <div class="outgoing_msg">
                    <div class="sent_msg">
                    <p>{{$message->content}}</p>
                    <span class="time_date">{{$message->created_at}}</span> </div>
                </div>
                @endif
                @endforeach
                @endif
                </div>
                <div class="type_msg">
                <div class="input_msg_write">
                    <form action="{{route('message.send',$contactid)}}" method="POST">
                    @csrf
                    <input name="message" type="text" class="write_msg" placeholder="Type a message" />
                    <button class="msg_send_btn" type="submit"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                    </form>
                </div>
                </div>
            </div>
    </div>    
  );
}

export default Accueil;
