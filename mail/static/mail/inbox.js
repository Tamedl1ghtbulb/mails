document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views + sendmail
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send_email;

  // By default, load the inbox
  load_mailbox('inbox');
});

function show_mail(element,mailbox){

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  if (mailbox === 'sent'){
    document.querySelector('#arhiva').style.display = 'none';
    document.querySelector('#arhivaa').style.display = 'none';

  }
  else if (mailbox === 'inbox'){
    document.querySelector('#arhiva').style.display = 'block';
    document.querySelector('#arhivaa').style.display = 'none';

    if (element.archived == 0){
      document.querySelector('#arhiva').style.display = 'block';
    }
    else if (element.archived == 1){
      document.querySelector('#arhiva').style.display = 'none';
    }

  }
  else if (mailbox === 'archive'){
    document.querySelector('#arhiva').style.display = 'none';
    document.querySelector('#arhivaa').style.display = 'block';
  }

  document.querySelector('#titl').innerHTML = `Subject: ${element.subject}`;
  document.querySelector('#posiljalac').innerHTML =`Sender: ${element.sender}`;
  const primaoci = element.recipients
  primaoci.forEach(function(prim){
    document.querySelector('#primalac').innerHTML =`Receipients: ${prim}`;
  });

  document.querySelector('#telo').innerHTML = element.body;
  document.querySelector('#vreme').innerHTML = element.timestamp;

  document.querySelector('#arhiva').onsubmit = function() {
    fetch(`/emails/${element.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
  }
  document.querySelector('#arhivaa').onsubmit = function() {
    fetch(`/emails/${element.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })
  }

  //document.querySelector('#reply').onsubmit = reply(element);
  const ele = element;
  document.querySelector('#replyy').addEventListener('submit', function(event){
      event.preventDefault()
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'block';
      document.querySelector('#email-view').style.display = 'none';

      document.querySelector('#compose-recipients').value = element.sender;
      document.querySelector('#compose-subject').value = `RE: ${element.subject}`;
      document.querySelector('#compose-body').value = `ON ${element.timestamp}, ${element.sender} wrote: ${element.body}`;
      return false;
  });
  fetch(`/emails/${element.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

  return false;
}
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    const svimai = emails;
    svimai.forEach(function(element){
      console.log(element);
      const elem = document.createElement('ul');
      elem.addEventListener('click', function() {
        show_mail(element,mailbox)
    })
      elem.classList.add('list-group-item');
      elem.innerHTML = `<h4>FROM: ${element.sender}</h4> <h5>Subject: ${element.subject}</h5>  <p>time:  ${element.timestamp}</p>`;
      document.querySelector('#emails-view').append(elem);
      if (element.read === false){
        elem.classList.add('bg-secondary');
      }
      else if (element.read === true){
        elem.classList.add('bg-light');
      }
    })
});

};


function send_email() {
  const re = document.querySelector('#compose-recipients').value;
  const su = document.querySelector('#compose-subject').value;
  const bo = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: re,
        subject: su,
        body: bo
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });


  return false;
}