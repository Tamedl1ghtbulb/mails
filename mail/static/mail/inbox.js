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
 // shows mail based on a clicked button via element
function show_mail(element,mailbox){

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  if (mailbox === 'sent'){
    document.querySelector('#archive').style.display = 'none';
    document.querySelector('#unarchivee').style.display = 'none';

  }
  else if (mailbox === 'inbox'){
    // show archieve button logic
    document.querySelector('#archive').style.display = 'block';
    document.querySelector('#unarchivee').style.display = 'none';

    if (element.archived == 0){
      document.querySelector('#archive').style.display = 'block';
    }
    else if (element.archived == 1){
      document.querySelector('#archive').style.display = 'none';
    }

  }
  // show unarchieve button logic
  else if (mailbox === 'archive'){
    document.querySelector('#archive').style.display = 'none';
    document.querySelector('#unarchivee').style.display = 'block';
  }
  // Inserts subject, sender, receipients etc. into HTML
  document.querySelector('#title').innerHTML = `<strong>Subject:</strong> ${element.subject}`;
  document.querySelector('#sender').innerHTML =`<div><strong>From:</strong> <span>${element.sender}</span><div></div>`;
  
  const primaoci = element.recipients
  // Accounts for all receipients
  primaoci.forEach(function(prim){
    document.querySelector('#receiver').innerHTML =`<strong>Receipients:</strong>: ${prim}`;
  });

  document.querySelector('#bodyy').innerHTML = element.body;
  document.querySelector('#time').innerHTML = `<strong>Timestamp:</strong>${element.timestamp}`;
  // Changes the archieve property (archieves it)
  document.querySelector('#archive').onsubmit = function() {
    fetch(`/emails/${element.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
  }
  // Changes the archieve property (unarchieves it)
  document.querySelector('#unarchivee').onsubmit = function() {
    fetch(`/emails/${element.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })
  }

  // shows compose email forms based on click, and hides other views. Also inserts sender,subject etc.
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
  // Changes the read property
  fetch(`/emails/${element.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

  return false;
}

 // Shows the view of compose emails via DOM
function compose_email() {

  // Shows compose view and hides other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  // Clears out fields
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
      //console.log(element);
      const elem = document.createElement('ul');
      elem.addEventListener('click', function() {
        show_mail(element,mailbox)
    })
      elem.classList.add('list-group-item');
      elem.innerHTML = `<h4>FROM: ${element.sender}</h4> <h5>Subject: ${element.subject}</h5>  <p>time:  ${element.timestamp}</p>`;
      document.querySelector('#emails-view').append(elem);
      if (element.read === false){
        elem.classList.add('bg-light');
      }
      else if (element.read === true){
        elem.classList.add('bg-secondary');
      }
    })
});

};


function send_email() {
  const receipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: receipients,
        subject: subject,
        body: body
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