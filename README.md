## Specification

Using JavaScript, HTML, and CSS, implementation of single-page-app email client that has following features:

### Mailbox: 

When a user visits their Inbox, Sent mailbox, or Archive, it loads the appropriate mailbox via GET request  to request the emails for a particular mailbox.
When a mailbox is visited, the application first queries the API for the latest emails in that mailbox.
When a mailbox is visited, the name of the mailbox appears at the top of the page.
Each email is then rendered in its own box that displays who the email is from, what the subject line is, and the timestamp of the email.
If the email is unread, it appears with a white background. If the email has been read, it appears with a gray background.

### Sent Mail: 
When a user submits the email composition form, JavaScript code sends a POST request passing in values for recipients, subject, and body.
Once the email has been sent, it loads the user’s sent mailbox.


### View Email:

When a user clicks on an email, the user is taken to a view where they see the content of that email via a GET request and displays email’s sender, recipient(s), subject, timestamp, and body.
Once the email has been clicked on it is marked as read via a PUT request.
Archive and Unarchive: Allow users to archive and unarchive emails that they have received.
When viewing an Inbox email, the user is presented with a button that lets them archive the email. When viewing an Archive email, the user is presented with a button that lets them unarchive the email. This is also done via a PUT request and this requirement does not apply to emails in the Sent mailbox.
Once an email has been archived or unarchived, the user’s inbox is loaded.

### Reply: 
Allow users to reply to an email.
When viewing an email, the user is presented with a “Reply” button that lets them reply to the email.
When the user clicks the “Reply” button, they are taken to the email composition form.
The composition form is pre-filled with the recipient field set to whoever sent the original email, with the subject line (comes after prefix "RE:") and with the body of the email with a line like "On Jan 1 2020, 12:00 AM somebody@example.com wrote:" followed by the original text of the email.

## Installation
1- Clone this repo
2- In the command line type:
```
$ cd mail
$ python3 -m venv venv
$ pip3 install -r requirements.txt
$ python3 manage.py runserver
```
3- Open your browser and go to localhost:8000
