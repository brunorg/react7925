import React, { Component, Fragment } from 'react';
import Cabecalho from '../components/Cabecalho'
import NavMenu from '../components/NavMenu'
import Dashboard from '../components/Dashboard'
import Widget from '../components/Widget'
import TrendsArea from '../components/TrendsArea'
import Tweet from '../components/Tweet'
import Helmet from 'react-helmet'
import Modal from '../components/Modal';

class App extends Component {

    constructor() {
        super()

        this.state = {
            novoTweet: 'alo alo w brazil',
            tweets: []
        }
        // this.adicionaTweet = this.adicionaTweet.bind(this)
    }
    
    // Métodos do Ciclo de Vida
    componentDidMount() {
        fetch(`http://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`)
        .then((respostaDoServer) => {
            return respostaDoServer.json()
        })
        .then((tweetsQueVieramDoServer) => {
            this.setState({
                tweets: tweetsQueVieramDoServer
            })
        })
    }

    adicionaTweet = (infoDosEvento) => {
        infoDosEvento.preventDefault()
        const novoTweet = this.state.novoTweet
        
        fetch(`http://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                // 'Authorization': localStorage.getItem('TOKEN')
            },
            body: JSON.stringify({ conteudo: novoTweet })
        })
        .then((respostaDoServer) => {
            return respostaDoServer.json()
        })
        .then((tweetQueVeioDoServer) => {
        // console.log('Resposta: ', tweetQueVeioDoServer)
            this.setState({
                tweets: [tweetQueVeioDoServer, ...this.state.tweets],
                novoTweet: ''
            })
        })
    }

    removeTweet = (idDoTweet) => {
        fetch(`http://twitelum-api.herokuapp.com/tweets/${idDoTweet}?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
            method: 'DELETE',
        })
        .then((res) => res.json())
        .then((respostaConvertida) => {
            console.log(respostaConvertida)
            const listaAtualizada = this.state.tweets.filter((tweetAtual) => {
                return tweetAtual._id !== idDoTweet
            })
    
            this.setState({
                tweets: listaAtualizada
            })
        })
    }


    abreModal = (objetoDoTweetClicado) => {
        console.log(objetoDoTweetClicado)
        // this.setState({
        //     tweetAtivo: {
        //         id: 'udsahudsa',
        //         conteudo: 'x',
        //         usuario: {}
        //     }
        // })
    }
    
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>{`Home (${this.state.tweets.length}) - Twitelum`}</title>
                </Helmet>
                <Cabecalho>
                    <NavMenu usuario="@omariosouto" />
                </Cabecalho>
                <div className="container">
                    <Dashboard>
                        <Widget>
                            <form className="novoTweet" onSubmit={this.adicionaTweet}>
                                <div className="novoTweet__editorArea">
                                {/* 
                                    Fazer o span receber essa classe:
                                    novoTweet__status--invalido

                                    somente quando a quantidade de caracteres
                                    for maior que 140
                                */}
                                    {/* Template String */}
                                    <span className={
                                            `novoTweet__status 
                                            ${
                                                this.state.novoTweet.length > 140
                                                ? 'novoTweet__status--invalido'
                                                : ''
                                            }`
                                    }>{this.state.novoTweet.length}/140</span>
                                    <textarea
                                        value={this.state.novoTweet}
                                        onChange={(infosDoEvento) => {
                                            const novoValor = infosDoEvento.target.value
                                            this.setState({
                                                novoTweet: novoValor
                                            })
                                            // this.state.novoTweet = novoValor
                                            // this.render()
                                        }}
                                        className="novoTweet__editor"
                                        placeholder="O que está acontecendo?"></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={
                                        this.state.novoTweet.length > 140 ||
                                        this.state.novoTweet.length === 0}
                                    className="novoTweet__envia">
                                    Tweetar
                                </button>
                            </form>
                        </Widget>
                        <Widget>
                            <TrendsArea />
                        </Widget>
                    </Dashboard>
                    <Dashboard posicao="centro">
                        <Widget>
                            <div className="tweetsArea">
                                {
                                    this.state.tweets.length === 0
                                    ? 'Cargando...'
                                    : '' 
                                }

                                {
                                    this.state.tweets.map((tweetAtual, indice) => {
                                        return <Tweet
                                            key={tweetAtual._id}
                                            id={tweetAtual._id}
                                            usuario={tweetAtual.usuario}
                                            texto={tweetAtual.conteudo}
                                            likeado={tweetAtual.likeado}
                                            removivel={tweetAtual.removivel}
                                            totalLikes={tweetAtual.totalLikes}
                                            removeHandler={() => this.removeTweet(tweetAtual._id)}
                                            handleAbreModal={() => this.abreModal(tweetAtual)}/>
                                            // Fazer o setState que limpa os tweets
                                            // na função removeTweet() na classe HomePage
                                    })
                                }
                            </div>
                        </Widget>
                    </Dashboard>
                </div>

                <Modal isAberto={false}>
                    <Widget>
                        <Tweet 
                            id="asudshu"
                            texto="xablau"
                            usuario={
                                {
                                    foto: 'asas',
                                    nome: 'Teste',
                                    login: 'x'
                                }
                            }
                        />
                    </Widget>
                </Modal>

            </Fragment>
        );
    }
}

export default App;
