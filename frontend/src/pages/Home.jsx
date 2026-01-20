import React from 'react'
import Header from '../components/Header.jsx'
import '../styles/index.css';

function Home(){
    return (
    <>
      <Header />
        <br />

        <div className='doboz'>
        <h1>Üdvözöljük a ResRater alkalmazásban!</h1>
        <br />
        <p>Fedezze fel a legjobb éttermeket, olvassa el a véleményeket, és ossza meg saját tapasztalatait másokkal!</p> 
        </div>
    </>
    )
}

export default Home;