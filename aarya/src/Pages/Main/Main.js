import React, { Component } from 'react';
import './Main.css';
import Card from '../../Components/Card/Card';


if (!('webkitSpeechRecognition' in window)) {
    alert('Voice recognition not supported on your device')
} else { //Let’s do some cool stuff :)
    var recognition = new window.webkitSpeechRecognition(); //That is the object that will manage our whole recognition process. 
    recognition.continuous = true;   //Suitable for dictation. 
    recognition.interimResults = true;  //If we want to start receiving results even if they are not final.
    //Define some more additional parameters for the recognition:
    recognition.lang = "en-US"; 
    recognition.maxAlternatives = 1; //Since from our experience, the highest result is really the best...
    console.log('Speech set up!')
}

export default class Main extends Component{

    constructor(){
        super()
        this.state = {
            listening: false,
            data: [],
            sentence: '',
            loading: false,
            steps: ''
        }
    }

    listenToggle = () => {
        this.setState({listening: !this.state.listening}, () => {
            if (this.state.listening) {
                document.getElementById('listen-btn-trans').id = 'listen-btn-white'
                this.startRecord();
            }
    
            else{
                document.getElementById('listen-btn-white').id = 'listen-btn-trans'
                this.endRecord();
            }

        })
    }

    startRecord(){
        this.setState({
            listening: true, data: ''
        },() => {
            recognition.start()
        })
        
    }

    endRecord(){
        this.setState({
            listening: false
        },() => {
            recognition.stop();
        })
    }

    initializeVoice(){
        recognition.onresult = (event) => {
            for (var i = event.resultIndex; i < event.results.length; ++i) {      
                if (event.results[i].isFinal) { //Final results
                    this.setState({sentence: event.results[i][0].transcript, loading: true}, () => {
                        fetch('https://aarya-api.herokuapp.com/rakeit',{
                            method: 'post',
                            headers: {'Content-type':'application/json'},
                            body: JSON.stringify({
                                sentence: this.state.sentence
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                            this.setState({data: data.data, steps: data.steps})
                        })
                    })
                    this.setState({loading: false}) 
                } else {   //i.e. interim...
                    // console.log("interim results: " + event.results[i][0].transcript);  //You can use these results to give the user near real time experience.
                }
            } 
        }
        
    }

    componentDidMount(){
        this.initializeVoice();
    }
    render(){
        
        if (typeof(this.state.data) === 'object' && this.state.data.length){

            if (this.state.steps) {

                var rows = this.state.data.map((obj,i) => {
                    return(
                        <Card link={obj} word={"Step "+i}/>
                    );
                })

            }

            else {

                var rows = this.state.data.map((obj,i) => {
                    return(
                        <Card link={obj.image_url} word={obj.search_word}/>
                    );
                })
            }
        }




        return(
            <div id='main'>
                <div id='main-stuff'>
                    <div>
                        <div onClick={this.listenToggle} id='listen-btn-trans'>
                        </div>
                    </div>
                    {
                        this.state.listening ? 
                        <p id='help-text'>Listening...</p>
                        :
                        <p id='help-text'>Tap the icon to begin</p>
                    }
                    
                </div>
                <div id='img-col'>
                    <div id='img-display'>
                    

                    {
                        this.state.loading ?
                        <p id='help-text2'>Fetching...</p>
                        :
                            this.state.listening ?
                            
                                <p id='trying-text'>Trying to get results for you...</p>
                                    :
                                this.state.data.length ? 
                                <div>
                                        <h4 style={{
                                            "fontWeight" :"100"
                                        }}><i>Follow the sequence below...</i></h4>
                                        <div id='img-holder'>

                                        {rows}
                                        
                                        </div>
                                </div>
                            :
                            <p id='help-text2'>Results will be displayed here</p>
                    }
                        

                    </div>
                </div>
            </div>
        );
    }
}