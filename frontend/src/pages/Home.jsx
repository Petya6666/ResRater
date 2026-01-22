import React from 'react'
import Header from '../components/Header.jsx'
import '../styles/index.css';
import Card from 'react-bootstrap/Card';

function Home(){
    return (
    <>
      <Header />
      <br />

      <div className='doboz'>
      <h1>Üdvözöljük a ResRater oldalán!</h1>
      <br />
      <p>Fedezze fel a legjobb éttermeket, olvassa el a véleményeket, és ossza meg saját tapasztalatait másokkal!</p> 
      <br />
      <br />
      </div>
      <div className='card-container' >
      <Card >
      <Card.Img variant="top" src="./public/noFilter.png"  className='kep'/>
      <Card.Body className='kartya'>
        <Card.Title className='feher'>Kardos Tamás</Card.Title>
        <Card.Text className='feher'>
        Backend fejlesztő
        </Card.Text>
      </Card.Body>
      </Card>
      <Card >
      <Card.Img variant="top" src="./public/noFilter.png"  className='kep'/>
      <Card.Body className='kartya'>
        <Card.Title className='feher'>Pálházi Péter</Card.Title>
        <Card.Text className='feher'>
        Frontend fejlesztő
        </Card.Text>
      </Card.Body>
      </Card>
      <Card >
      <Card.Img variant="top" src="./public/noFilter.png"  className='kep' />
      <Card.Body className='kartya'>
        <Card.Title className='feher'>Papp Zsombor</Card.Title>
        <Card.Text className='feher'>
        Adatbázis fejlesztő
        </Card.Text>
      </Card.Body>
      </Card>
      </div>
    </>
    )
}

export default Home;