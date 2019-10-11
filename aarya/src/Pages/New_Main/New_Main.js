import React, { Component } from 'react';
import './New_Main.css';
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

export default class New_Main extends Component{
    constructor(){
        super()
        this.state = {
            sentence: '',
            data: [],
            steps: '',
            loading_text: 'Setting things up...'
        }
    }

    startRecord = () => {
        console.log('Started')
        this.setState({
            listening: true,loading_text: 'Listening...'
        },() => {
            recognition.start()
        })
        
    }

    endRecord(){
        console.log('Ended')
        this.setState({
            listening: false
        },() => {
            recognition.stop();
        })
    }

    onListening(){
        recognition.onresult = (event) => {
            for (var i = event.resultIndex; i < event.results.length; ++i) {      
                if (event.results[i].isFinal) { //Final results
                    this.setState({sentence: event.results[i][0].transcript, loading: true}, () => {
                        fetch('http://localhost:8080/rakeit',{
                            method: 'post',
                            headers: {'Content-type':'application/json'},
                            body: JSON.stringify({
                                sentence: this.state.sentence
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log(this.state)
                            this.setState({data: data.data, steps: data.steps})
                        })
                    })
                    this.setState({loading: false}) 
                } else {   //i.e. interim...
                    this.setState({sentence: event.results[i][0].transcript}) 
                }
            } 
        }
    }

    componentDidMount(){
        this.onListening();

        this.startRecord();
        setTimeout(function(){
            this.endRecord();
        }
        .bind(this)
        ,5000)

        setInterval(function(){
            this.startRecord()
            setTimeout(function(){
                this.endRecord();
            }
            .bind(this)
            ,8000)
        }
        .bind(this)
        ,15000)

    }
    render(){
        if (typeof(this.state.data) === 'object' && this.state.data.length){

            if (this.state.steps) {

                var rows = this.state.data.map((obj,i) => {
                    if (obj !== null ){

                        return(
                            <Card friendly={true} link={obj} word={"Step "+(i+1)}/>
                        );
                    }
                })

            }

            else {

                var rows = this.state.data.map((obj,i) => {
                    if (obj.image_url !== null) {
                        return(

                            <Card link={obj.image_url} word={obj.search_word} friendly={obj.friendly} />
                        );
                    }
                })
            }
        }

        return(
        <div id='new_main'>
            
            <div id='img-view'>
                {
                    this.state.data.length ? 
                    <div>
                        <p style={{
                            "color" :"#fff",
                            "fontSize" : "18px",
                            "marginTop" :"14px"
                        }}><strong>Follow the sequence...</strong></p>
                        <div id='img-holder'>
                            {rows}   
                        </div>
                        <br/>
                        <br/>
                        <p style={{
                            "textAlign" :"center",
                            "color" :"#fff",
                            "marginTop" :"4px"
                        }}><i>Swipe to view more</i></p>
                    </div>
                    :
                    null
                }

            </div>

            <div id='text-view'>
                {
                    this.state.sentence.length?
                    <p id='text-main'>{this.state.sentence}</p>
                    :
                    <p id='text-loading'>{this.state.loading_text}</p>
                }
            </div>
        </div>

        );
    }
}