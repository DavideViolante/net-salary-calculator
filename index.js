function main() {
  const regioni = ['Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia Romagna', 'Friuli Venezia Giulia', 'Lazio',
    'Liguria', 'Lombardia', 'Marche', 'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 'Trentino Alto Adige',
    'Umbria', 'Valle d\'Aosta', 'Veneto', 'Provincia di Bolzano'];
  // EDIT BELOW THIS LINE -------------
  const reddito = process.argv[2] || 42000;
  const regione = regioni[8]; // Lombardia
  const coniugueAcarico = false;
  const figliAcaricoInf3 = 0;
  const figliAcaricoSup3 = 0;
  const figliHandicapInf3 = 0;
  const figliHandicapSup3 = 0;
  const percentualeCaricoFigli = 100;
  const altriFamiliariCarico = 0;
  const numMensilita = 13;
  const giorniLavorativi = 365;
  // DON'T EDIT BELOW THIS LINE --------

  const percentualeINPS = 9.19;
  const contributoINPS = reddito * percentualeINPS / 100;
  const imponibile = reddito - contributoINPS;

  const irpefLordaStatale = calcolaIrpefStatale(imponibile);
  const irpefLordaRegionale = calcolaIrpefRegionale(imponibile, regione);
  const irpefLordaComunale = imponibile * 0.2 / 100;
  const irpefLorda = irpefLordaStatale + irpefLordaRegionale + irpefLordaComunale;

  const detrazioniDipendente = calcolaDetrazioniDipendente(imponibile, giorniLavorativi);
  const detrazioniConiuge = coniugueAcarico ? calcolaDetrazioniConiuge(imponibile, giorniLavorativi) : 0;
  const detrazioniFigli = calcolaDetrazioniFigli(imponibile, percentualeCaricoFigli, figliAcaricoInf3, figliAcaricoSup3, figliHandicapInf3, figliHandicapSup3);
  const detrazioniFamiglieNumerose = calcolaDetrazioniFamiglieNumerose(percentualeCaricoFigli, figliAcaricoInf3, figliAcaricoSup3);
  const detrazioniAltriFamiliari = 750 * altriFamiliariCarico * (80000 - imponibile) / 80000;
  const detrazioni = detrazioniDipendente + detrazioniConiuge + detrazioniFigli + detrazioniFamiglieNumerose + detrazioniAltriFamiliari;

  let irpefNetta = irpefLorda - detrazioni;
  if (irpefNetta < 0) {
    irpefNetta = 0;
  }
  const stipendioAnnuale = imponibile - irpefNetta;
  const stipendioMensile = stipendioAnnuale / numMensilita;
  console.log('Netto annuale:', stipendioAnnuale);
  console.log('Netto mensile:', stipendioMensile);
}

function calcolaIrpefStatale(imponibile) {
  let irpefLordaStatale = 0;
  const scaglioniIrpef = [8000, 15000, 28000, 55000, 75000];
  if (imponibile < scaglioniIrpef[0]) {
    irpefLordaStatale = 0;
  } else if (imponibile <= scaglioniIrpef[1]) {
    irpefLordaStatale = imponibile * 0.23;
  } else if (imponibile <= scaglioniIrpef[2]) {
    irpefLordaStatale = 3450 + (imponibile - scaglioniIrpef[1]) * 0.27;
  } else if (imponibile <= scaglioniIrpef[3]) {
    irpefLordaStatale = 6960 + (imponibile - scaglioniIrpef[2]) * 0.38;
  } else if (imponibile <= scaglioniIrpef[4]) {
    irpefLordaStatale = 17220 + (imponibile - scaglioniIrpef[3]) * 0.41;
  } else if (imponibile > scaglioniIrpef[4]) {
    irpefLordaStatale = 25420 + (imponibile - scaglioniIrpef[4]) * 0.43;
  }
  return irpefLordaStatale;
}

function calcolaIrpefRegionale(imponibile, regione) {
  const regioniIrpef1e4 = ['Abruzzo', 'Calabria', 'Campania', 'Lazio', 'Molise', 'Sicilia'];
  const irpef1e4 = 1.4;
  const regioniIrpef0e9 = ['Basilicata', 'Friuli Venezia Giulia', 'Sardegna', 'Toscana', 'Trentino Alto Adige', 'Valle d\'Aosta', 'Provincia di Bolzano']
  const irpef0e9 = 0.9;

  if (regioniIrpef1e4.includes(regione)) {
    irpefLordaRegionale = imponibile * irpef1e4 / 100;
  } else if (regioniIrpef0e9.includes(regione)) {
    irpefLordaRegionale = imponibile * irpef0e9 / 100;
  } else {
    switch (regione) {
      case 'Emilia Romagna':
        if (imponibile < 15001) {
          irpefLordaRegionale = imponibile * 1.1 / 100;
        } else if (imponibile < 20001) {
          irpefLordaRegionale = imponibile * 1.2 / 100 - 15000 * 0.1 / 100;
        } else if (imponibile < 25001) {
          irpefLordaRegionale = imponibile * 1.3 / 100 - 15000 * 0.2 / 100 - 5000 * 0.1 / 100;
        } else if (imponibile >= 25001) {
          irpefLordaRegionale = imponibile * 1.4 / 100 - 15000 * 0.3 / 100 - 5000 * 0.2 / 100 - 5000 * 0.1 / 100;
        }
        break;
      case 'Liguria':
        if (imponibile < 25001) {
          irpefLordaRegionale = imponibile * 0.9 / 100;
        } else if (imponibile >= 25001) {
          irpefLordaRegionale = imponibile * 1.4 / 100 - 25000 * 0.5 / 100;
        }
      case 'Lombardia':
        if (imponibile < 15493.72) {
          irpefLordaRegionale = imponibile * 0.9 / 100;
        } else if (imponibile < 30987.42) {
          irpefLordaRegionale = 15493.71 * 0.9 / 100 + (imponibile - 15493.72) * 1.3 / 100;
        } else if (imponibile >= 30987.42) {
          irpefLordaRegionale = 15493.71 * 0.9 / 100 + (30987.41 - 15493.71) * 1.3 / 100 + (imponibile - 30987.41) * 1.4 / 100;
        }
      case 'Marche':
        if (imponibile <= 15500) {
          irpefLordaRegionale = imponibile * 0.9 / 100;
        } else if (imponibile <= 31000) {
          irpefLordaRegionale = 15500 * 0.9 / 100 + (imponibile - 15500) * 1.2 / 100;
        } else if (imponibile > 31000) {
          irpefLordaRegionale = 15500 * 0.9 / 100 + (31000 - 15500) * 1.2 / 100 + (imponibile - 31000) * 1.4 / 100;
        }
      case 'Piemonte':
        if (imponibile <= 15000) {
          irpefLordaRegionale = imponibile * 0.9 / 100;
        } else if (imponibile <= 22000) {
          irpefLordaRegionale = 15000 * 0.9 / 100 + (imponibile - 15000) * 1.2 / 100;
        } else if (imponibile > 22000) {
          irpefLordaRegionale = 15000 * 0.9 / 100 + (22000 - 15000) * 1.2 / 100 + (imponibile - 22000) * 1.4 / 100;
        }
      case 'Puglia':
        if (imponibile <= 28000) {
          irpefLordaRegionale = imponibile * 0.9 / 100;
        } else if (imponibile > 28000) {
          irpefLordaRegionale = 28000 * 0.9 / 100 + (imponibile - 28000) * 1.4 / 100;
        }
      case 'Umbria':
        if (imponibile <= 15000) {
          irpefLordaRegionale = imponibile * 0.9 / 100;
        } else if (imponibile > 15000) {
          irpefLordaRegionale = 15000 * 0.9 / 100 + (imponibile - 15000) * 1.1 / 100;
        }
      case 'Veneto':
        if (imponibile <= 29500) {
          irpefLordaRegionale = imponibile * 0.9 / 100;
        } else if (imponibile > 29500) {
          irpefLordaRegionale = 29500 * 0.9 / 100 + (imponibile - 29500) * 1.4 / 100;
        }
    }
  }
  return irpefLordaRegionale;
}

function calcolaDetrazioniDipendente(imponibile, giorniLavorativi) {
  let detrazioniDipendente = 0;
  if (imponibile < 8000) {
    detrazioniDipendente = 1840 * giorniLavorativi / 360;
  } else if (imponibile <= 15000) {
    detrazioniDipendente = 1338 + 502 * (15000 - imponibile) / 7000;
    detrazioniDipendente = detrazioniDipendente * giorniLavorativi / 360;
  } else if (imponibile <= 55000) {
    detrazioniDipendente = 1338 * (55000 - imponibile) / 40000 * giorniLavorativi / 360;
    if (imponibile > 23000 && imponibile <= 24000) {
      detrazioniDipendente = detrazioniDipendente + 10;
    } else if (imponibile > 24000 && imponibile <= 25000) {
      detrazioniDipendente = detrazioniDipendente + 20;
    } else if (imponibile > 25000 && imponibile <= 26000) {
      detrazioniDipendente = detrazioniDipendente + 30;
    } else if (imponibile > 26000 && imponibile <= 27700) {
      detrazioniDipendente = detrazioniDipendente + 40;
    } else if (imponibile > 27700 && imponibile <= 28000) {
      detrazioniDipendente = detrazioniDipendente + 25;
    }
  }
  return detrazioniDipendente;
}

function calcolaDetrazioniConiuge(imponibile, giorniLavorativi) {
  let detrazioniConiuge = 0;
  if (imponibile < 15000) {
    detrazioniConiuge = 800 - 110 * imponibile / 15000;
    detrazioniConiuge = detrazioniConiuge * giorniLavorativi / 360;
  }
  else if (imponibile <= 40000) {
    detrazioniConiuge = 690;
    detrazioniConiuge = detrazioniConiuge * giorniLavorativi / 360;
    if (imponibile > 29000 && imponibile <= 29200) {
      detrazioniConiuge = detrazioniConiuge + 10;
    } else if (imponibile > 29200 && imponibile <= 34700) {
      detrazioniConiuge = detrazioniConiuge + 20;
    } else if (imponibile > 34700 && imponibile <= 35000) {
      detrazioniConiuge = detrazioniConiuge + 30;
    } else if (imponibile > 35000 && imponibile <= 35100) {
      detrazioniConiuge = detrazioniConiuge + 20;
    } else if (imponibile > 35100 && imponibile <= 35200) {
      detrazioniConiuge = detrazioniConiuge + 10;
    }
  } else if (imponibile <= 80000) {
    detrazioniConiuge = 690 * (80000 - imponibile) / 40000;
    detrazioniConiuge = detrazioniConiuge * giorniLavorativi / 360;
  }
  return detrazioniConiuge;
}

function calcolaDetrazioniFigli(imponibile, percentualeCaricoFigli, figliAcaricoInf3, figliAcaricoSup3, figliHandicapInf3, figliHandicapSup3) {
  const figli = figliAcaricoInf3 + figliAcaricoSup3;
  const figliHandicap = figliHandicapInf3 + figliHandicapSup3;
  let detrazioneBase = 0;
  let detrazioniFigli = 0;
  if (figli > 3) {
    detrazioneBase = figliAcaricoInf3 * 1000 + figliAcaricoSup3 * 1100 + figliHandicap * 220;
    detrazioneBase = detrazioneBase * percentualeCaricoFigli / 100;
    detrazioniFigli = detrazioneBase * (95000 + 15000 * (figli - 1) - imponibile) / (95000 + 15000 * (figli - 1));
  } else if (figli <= 3) {
    detrazioneBase = figliAcaricoInf3 * 800 + figliAcaricoSup3 * 900 + figliHandicap * 220;
    detrazioneBase = detrazioneBase * percentualeCaricoFigli / 100;
    detrazioniFigli = detrazioneBase * (95000 + 15000 * (figli - 1) - imponibile) / (95000 + 15000 * (figli - 1));
  }
  return detrazioniFigli;
}

function calcolaDetrazioniFamiglieNumerose(percentualeCaricoFigli, figliAcaricoInf3, figliAcaricoSup3) {
  const figli = figliAcaricoInf3 + figliAcaricoSup3;
  let detrazioniFamiglieNumerose = 0;
  if (figli >= 4) {
    detrazioniFamiglieNumerose = 1200 * percentualeCaricoFigli / 100;
  }
  return detrazioniFamiglieNumerose;
}

main();
