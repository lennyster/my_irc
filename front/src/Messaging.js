import React, { Component, Fragment,  useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery'
import io from 'socket.io-client';
const ENDPOINT = 'http://localhost:4242';
const socket = io(ENDPOINT);


class Messaging extends Component {
    
    state = {
        show: false,
        name: null,
        message: null,
        chat: [],
        owner: [],
        channel: [],
    };

    // componentDidMount(){
    // }

    messaging(){
        return(
    <Fragment>
    <div id="sidepanel">
		<div id="profile">
			<div class="wrap">
				<p>{this.state.name}</p>
				<i class="fa fa-chevron-down expand-button" aria-hidden="true"></i>
				<div id="expanded">
					<label for="twitter"><i class="fa fa-facebook fa-fw" aria-hidden="true"></i></label>
					<input name="twitter" type="text" value="mikeross" />
					<label for="twitter"><i class="fa fa-twitter fa-fw" aria-hidden="true"></i></label>
					<input name="twitter" type="text" value="ross81" />
					<label for="twitter"><i class="fa fa-instagram fa-fw" aria-hidden="true"></i></label>
					<input name="twitter" type="text" value="mike.ross" />
				</div>
			</div>
		</div>
		<div id="search">
			<label for=""><i class="fa fa-search" aria-hidden="true"></i></label>
			<input type="text" placeholder="Search contacts..." />
		</div>
		<div id="contacts">
			<ul>
				<li class="contact">
					<div class="wrap">
						<div class="meta">
							<p class="name channel">Rachel Zane</p>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div id="bottom-bar">
			<button id="addcontact"><i class="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add channel</span></button>
			<button id="settings"><i class="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
		</div>
	</div>
	<div class="content">
		<div class="contact-profile">
			<p>Channel</p>
			<div class="social-media">
			</div>
		</div>
		<div class="messages">
			<ul>
                {this.state.chat.map(e => {
                    return(
                    <li class="replies">
                        <p>{e}</p>
                    </li>
                    )
                })
                }
                
			</ul>
		</div>
		<div class="message-input">
			<div class="wrap">
			<input type="text" id="message" onChange={this.handleChangeMessage} name="message" placeholder="Write your message..." />
			<i class="fa fa-paperclip attachment" aria-hidden="true"></i>
			<button onClick={this.handleClickMessage} class="submit">Send</button>
			</div>
		</div>
        </div>
        </Fragment>
        )
    }

    


    handleChange = e => {
        this.setState({
          [e.target.name]: e.target.value,
        });
     
    };

    handleClick = e => {
        let inputUsername = this.state.name,
        username,
        allUsers
        inputUsername = $.trim(inputUsername)
        if (inputUsername.length > 1) {
            socket.emit('setUsername', inputUsername)
            socket.on('acceptUsername', (_username, _allUsers) => {
                allUsers = _allUsers;
                username = _username;
                this.setState({
                    show: true,
                  });
            })
            socket.on('rejectUsername', (_username) => {
                this.setState({
                    name: "",
                  });;
                  $("#pseudo").val("")
                  $("#pseudo").attr('placeholder', "Username already taken")
            })
        }
    }
    
    handleChangeMessage = e => {
        this.setState({
            message: e.target.value,
          });
    }

    // chat = e => {
    //     this.state.chat.map(e => {
    //         <li class="replies">
    //             <p>{e}</p>
	// 		</li>
    //     })
    // }



    handleClickMessage = e => {
        if(this.state.message !== ''){
            socket.emit('chatmessage', this.state.message)
            this.setState({
                message: "",
              });

            let array = this.state.chat
            array.push(this.state.message)
            console.log(array);
            this.setState({chat: array})
            $("#message").val("")
            this.setState({
                gitan:null
            })
        }
    }

    getmessages = async () => {
        socket.on('chatmessage', message => {
            console.log(message)
            let array = this.state.chat
            array.push(message.message)
            let array2 = this.state.owner
            array2.push(message.from)
            this.setState({ chat : array, owner : array2});
            // this.state.chat.push(message.message)
            // this.state.owner.push(message.from)
        })
    }

    getChannels = async () => {
        
    }


    componentDidMount()
    {
        this.getmessages();
    }

    // componentWillUnmount()
    // {
    //     socket.on('chatmessage', message => {
    //         console.log(message)
    //         this.state.chat.push(message.message)
    //         this.state.owner.push(message.from)
    //     })
    // }
    listChanel = e => () {
        
    }

    render(){
        return(
            <div id="frame">
                { 
                    this.state.show ? this.messaging() : <div className="name">
                    <h1>Psuedo</h1>
                    <input id="pseudo"onChange={this.handleChange} name="name"></input>
                    <button onClick={this.handleClick}>Enter</button>
                    </div>
                } 
            </div> 


        )
    }
}

export default Messaging;