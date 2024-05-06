ROTTE PER ACCEDERE ALLE FUNZIONI:

Per l'AGGIUNTA di un nuovo progetto

  /AggiuntaProgetto metodo POST
  dati richiesti: 
  
      id,
      nome,
      descrizione,
      data_inizio,
      data_fine,
      latitudine,
      longitudine,
      eta_minima


Per la MODIFICA di un progetto esistente:

  /ModificaProgetto metodo POST
  dati richiesti:
  
      id
      nome,
      descrizione,
      data_inizio,
      data_fine,
      latitudine,
      longitudine,
      eta_minima


Per l'ELIMINAZIONE di un progetto esistente:
    /EliminazioneProgetto metodo POST
    dati richiesti:
  
      id





LIBRERIE E MIDDLEWARE ESTERNI UTILIZZATI:

	Express, 
	Axios,
	Morgan,
	Cors,
	PUG
