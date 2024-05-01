//framework per la gestione di web app e API
const express = require('express');
const app = express();
const fs = require('fs'); 
//morgan è un middleware di Express che gestisce i log http per il monitoraggio
const morgan = require('morgan'); 
const path = require('path'); 
//helmet è un middleware che aumenta la sicurezza 
const helmet = require('helmet'); 
//middleware di sicurezza che consente alle risorse web di essere richieste da un dominio differente da quello da cui provengono
const cors = require('cors');
const bodyParser = require('body-parser');
//axios è una libreria che facilità la comunicazione con le API tramite richieste e risposte HTTP
const axios = require('axios');
//assegnaziazione ad appname il nome Volontariato, utilizzato per express


const PORT = 3000;
app.set('appName', 'Volontariato'); 
app.set('port', process.env.PORT || PORT); 

//aggiunta al file access.log i log degli accessi (a sta per append quidni aggiunta in fondo)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
//utilizzo del middleware morgan per la gestione del logging delle richieste HTTP, con short vengono salvati solo i dati essenziali
app.use(morgan('short', { stream: accessLogStream }));
app.use(helmet());

app.use(cors());



//configurazione del bodyparser per la gestione dei dati inviati tramite http
app.use(bodyParser.urlencoded({ extended: true }));
//gestisce il tipo di dati inviati con il contenuto json
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));



app.get('/AggiuntaProgetto', (req, res) => {
  res.render('AggiuntaProgetto');
});


app.get('/EliminazioneProgetto/:ID', (req, res) => {
  res.render('EliminazioneProgetto');
});


app.get('/ModificazioneProgetto/:ID', (req, res) => {
  //const progettoID = req.params.id;
  res.render('ModificazioneProgetto');
});

app.get('/VistaProgetti', (req, res) => {
  res.render('VistaProgetti');
});

app.get('/', (req, res) => {
  res.render('Index');
});



app.get('/VistaProgetti', async (req, res) => {
  try {
    const response = await axios.get('http://scamanit.alwaysdata.net/progetto');
    const dati = response.data;

    res.render('VistaProgetti', { dati });

  } catch (error) {
    console.error("Errore durante il recupero dei dati da Alwaysdata:", error);
    res.status(500).send("Si è verificato un errore durante il recupero dei dati da Alwaysdata.");
  }
});



app.post('/AggiuntaProgetto', (req, res) => {
  const { ID, nome, descrizione, data_inizio, data_fine, latitudine, longitudine, eta_minima } = req.body;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://scamanit.alwaysdata.net/progetto',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      "progetto":
      ID,
      nome,
      descrizione,
      data_inizio,
      data_fine,
      latitudine,
      longitudine,
      eta_minima
    }
  };

  axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

});


/*const nuovoProgetto = {
  ID: 5,
  nome: "Nuovo Progetto",
  descrizione: "Descrizione del nuovo progetto",
  data_inizio: "2024-05-20",
  data_fine: "2024-05-22",
  latitudine: "45.12345",
  longitudine: "9.54321",
  eta_minima: 18
};

// Effettua la richiesta POST
axios.post('http://scamanit.alwaysdata.net/', nuovoProgetto)
  .then(response => {
      console.log("Record creato con successo:", response.data);
  })
  .catch(error => {
      console.error("Errore durante la creazione del record:", error);
  });
*/


/*app.post('/AggiuntaProgetto', async (req, res) => {
  try {
      const datiProgetto = await axios.get('http://scamanit.alwaysdata.net/progetto');

      // Supponendo che tu stia utilizzando un ORM come Sequelize per interagire con il database
      await progetto.create({
          nome: datiProgetto.data.nome,
          descrizione: datiProgetto.data.descrizione,
          data_inizio: datiProgetto.data.data_inizio,
          data_fine: datiProgetto.data.data_fine,
          latitudine: datiProgetto.data.latitudine,
          longitudine: datiProgetto.data.longitudine,
          eta_minima: datiProgetto.data.eta_minima
      });

      res.send("Dati aggiunti con successo al database.");
  } catch (error) {
      console.error("Errore durante l'aggiunta dei dati al database:", error);
      res.status(500).send("Si è verificato un errore durante l'aggiunta dei dati al database.");
  }
});
*/


app.post('/ModificaProgetto/:ID', (req, res) => {
  const { ID, nome, descrizione, data_inizio, data_fine, latitudine, longitudine, eta_minima } = req.body;

  let config = {
    method: 'put', 
    maxBodyLength: Infinity,
    url: `http://scamanit.alwaysdata.net/progetto/${ID}`, 
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      nome,
      descrizione,
      data_inizio,
      data_fine,
      latitudine,
      longitudine,
      eta_minima
    }
  };

  axios.request(config)
    .then((response) => {
      console.log("Progetto modificato con successo:", response.data);
      res.send("Progetto modificato con successo!");
    })
    .catch((error) => {
      console.error("Errore durante la modifica del progetto:", error);
      res.status(500).send("Si è verificato un errore durante la modifica del progetto.");
    });

});




app.post('/EliminazioneProgetto/:ID', (req, res) => {
  const ID = req.params.ID; 
  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `http://scamanit.alwaysdata.net/progetto/${ID}`, 
    headers: {},
    data: {
      ID
    }
  };

  axios.request(config)
    .then((response) => {
      console.log("Progetto eliminato con successo:", response.data);
      res.send("Progetto eliminato con successo!");
    })
    .catch((error) => {
      console.error("Errore durante l'eliminazione del progetto:", error);
      res.status(500).send("Si è verificato un errore durante l'eliminazione del progetto.");
    });
});


const server = app.listen(app.get('port'), function () {
  console.log('Server in ascolto alla porta ' + PORT); // Stampa la porta utilizzata
});