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

app.use("/public", express.static(path.join(__dirname, "public")));


//configurazione del bodyparser per la gestione dei dati inviati tramite http
app.use(bodyParser.urlencoded({ extended: true }));
//gestisce il tipo di dati inviati con il contenuto json
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


function validaDatiProgetto(req) {
  const { id, nome, descrizione, data_inizio, data_fine, latitudine, longitudine, eta_minima } = req.body;
  const idNum = parseInt(id);
  const latitudineNum = parseFloat(latitudine);
  const longitudineNum = parseFloat(longitudine);
  const etaMinimaNum = parseInt(eta_minima);

  const dataInizioDate = new Date(data_inizio);
  const dataFineDate = new Date(data_fine);

  // Esegui i controlli sui dati e restituisci eventuali errori
  if (isNaN(idNum) || isNaN(latitudineNum) || isNaN(longitudineNum) || isNaN(etaMinimaNum)) {
    return {
      errore: 'Formato dati errato',
      dettagli: 'id, latitudine, longitudine, eta_minima devono essere numerici'
    };
  }

  if (etaMinimaNum < 0) {
    return {
      errore: 'Dati inseriti impossibili',
      dettagli: 'Non è possibile inserire un età minima negativa'
    };
  }

  if (typeof nome !== 'string' || typeof descrizione !== 'string') {
    return {
      errore: 'Formato dati errato',
      dettagli: 'nome e descrizione devono essere stringhe'
    };
  }

  if (isNaN(dataInizioDate.getTime()) || isNaN(dataFineDate.getTime())) {
    return {
      errore: 'Formato dati errato',
      dettagli: 'data_inizio e data_fine devono essere date valide'
    };
  }

  if (dataInizioDate >= dataFineDate) {
    return {
      errore: 'Dati inseriti impossibili',
      dettagli: 'La data di inizio deve essere precedente alla data di fine'
    };
  }

  // Se tutti i controlli passano, i dati sono validi
  return { valido: true };
}



app.get('/AggiuntaProgetto', (req, res) => {
  res.render('AggiuntaProgetto');
});


app.get('/EliminazioneProgetto', (req, res) => {
  res.render('EliminazioneProgetto');
});


app.get('/ModificazioneProgetto', (req, res) => {
  res.render('ModificazioneProgetto');
});


app.get('/', (req, res) => {
  res.render('Index');
});

app.get('/Index', (req, res) => {
  res.render('Index');
});

app.get('/ResponsoPositivo', (req, res) => {
  res.render('ResponsoPositivo');
});

app.get('/ResponsoNegativo', (req, res) => {
  res.render('ResponsoNegativo');
});



app.get('/VistaProgetti', async (req, res) => {
  try {
    const response = await axios.get('http://scamanit.alwaysdata.net/progetto');
    const dati = response.data;

    res.render('VistaProgetti', { dati });

  } catch (error) {
    console.error("Errore durante il recupero dei dati da Alwaysdata:", error);
    res.redirect('/ResponsoNegativo');

  }
});



app.post('/AggiuntaProgetto', (req, res) => {
  const risultatoValidazione = validaDatiProgetto(req);

  if (risultatoValidazione.valido) {
    // I dati sono validi, procedi con l'invio al server
    const { id, nome, descrizione, data_inizio, data_fine, latitudine, longitudine, eta_minima } = req.body;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://scamanit.alwaysdata.net/progetto',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        id,
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
        res.redirect('/ResponsoPositivo');
      })
      .catch((error) => {
        console.log(error);
        res.redirect('/ResponsoNegativo');
      });
  } else {
    // I dati non sono validi, mostra messaggio di errore
    const { errore, dettagli } = risultatoValidazione;
    console.error(errore, dettagli);
    res.status(400).render('ResponsoNegativo', { errore: errore, dettagli: dettagli })
  }

});



app.post('/EliminazioneProgetto', (req, res) => {
  const id = req.params.id;
  try {
    const validatedData = validateData({
      id
    });


    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `http://scamanit.alwaysdata.net/progetto/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: validatedData
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        res.redirect('/ResponsoPositivo');
      })
  }
  catch (error) {
    // Gestisci l'errore di convalida
    console.error(error.message);
    res.redirect('/ResponsoNegativo');
  }
});

app.post('/ModificaProgetto', (req, res) => {
  const { id, nome, descrizione, data_inizio, data_fine, latitudine, longitudine, eta_minima } = req.body;

  let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `http://scamanit.alwaysdata.net/progetto/${id}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      id,
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
      res.redirect('/ResponsoPositivo');
    })
    .catch((error) => {
      console.log(error);
      res.redirect('/ResponsoNegativo');
    });

});







const server = app.listen(app.get('port'), function () {
  console.log('Server in ascolto alla porta ' + PORT);
});