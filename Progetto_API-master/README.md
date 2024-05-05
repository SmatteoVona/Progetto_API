ROTTE PER ACCEDERE ALLE FUNZIONI:

Per l'AGGIUNTA di un nuovo progetto

  /AggiuntaProgetto metodo POST
  dati richiesti: 
  
      ID,
      nome,
      descrizione,
      data_inizio,
      data_fine,
      latitudine,
      longitudine,
      eta_minima


Per la MODIFICA di un progetto esistente:

  /ModificaProgetto/{progettoID} metodo POST
  dati richiesti:
  
      nome,
      descrizione,
      data_inizio,
      data_fine,
      latitudine,
      longitudine,
      eta_minima


Per l'ELIMINAZIONE di un progetto esistente:
    /EliminazioneProgetto/{progettoID} metodo POST





LIBRERIE E MIDDLEWARE ESTERNI UTILIZZATI:

	Express, 
	Axios,
	Morgan,
	Cors,
	PUG
