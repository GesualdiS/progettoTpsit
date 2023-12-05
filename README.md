# PRIVATECHAT
Compito di Tpsit di Simone Gesualdi con NodeJS.
===
Scopo: creare un sito di messaggistica online che prende seriamente la privacy dei propri customers.
Requisiti:
- creare un account per ogni customer;
- verificare la mail del signin;
- aggiungere la verifica a due fattori;
- poter passare soldi a un amico;
- usare cloudflare per connettersi al sito;
- fare messaggiare due utenti con immagini, testo, video... 
- i customer possono creare dei gruppi;
Target: persone interessate a scrivere messaggi su browser/computer.
Competitors: whatsapp, telegram, instagram...
===
DATA MODELLING
In questa fase definiamo le tabelle che ci serviranno per il nostro database. 
Useremo:
- Users, per salvare i customer che usano la nostra applicazione;
- Groups, per permettere ai customers di creare dei gruppi;
- Messages (video, immagini e testo), per salvare i messaggi che si scrivono gli utenti;
Schema ER:

===
Funzionalità implementate fin'ora:
- poter creare un utente;
- poter cambiare la password o la email dell'utente;
- poter eliminare un utente;
- cryptare la password quando arriva per poi salvarla nel database;

Cose da fare

Note:
- ho cambiato da or in and questa condizione
    else if(results.affectedRows == 1 && await bcrypt.compare(oldPassword, results[0].password))
  verificare che non dà errore a casa
- verificare updateUserPassword;
