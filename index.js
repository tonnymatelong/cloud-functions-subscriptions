// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const dotenv = require('dotenv').config();
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');


dotenv.config();
// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");

const form = document.getElementById('contactForm');
const alert = document.querySelector('.alert');


const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  initializeApp();

  const database = firebase.database();
  
  const ref = database.ref('contacts');
  
  form.addEventListener('submit', (e) =>{
      e.preventDefault();
  
      const testerName = document.getElementById('testerName').value;
      const testerEmail = document.getElementById('testerEmail').value;
  
      ref.push({
          name: testerName,
          email: testerEmail
      })


      
      alert.style.display = 'block';
  
      setTimeout(() =>{
          alert.style.display = 'none';
      }, 2000);
  
      form.reset();

      //Creating Nodemailer transporter using your Mailtrap SMTP details
      let transporter = nodemailer.createTransport({
        host: process.env.host,
      port: process.env.port,
      auth: {
        user: process.env.user,
        pass: process.env.pass
      }
      });

      exports.sendEmail = functions.region('europe-west1').https.onRequest(async (req, res) => {
      const { MailtrapClient } = require("mailtrap");

      const TOKEN = process.env.tokens;
      const ENDPOINT = process.env.endpoints;

      const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

      const mailLink = process.env.mailLink;
      const callLink = process.env.callLink;
      const sendLink = process.env.sendLink;



      const sender = {
        email: process.env.email,
        name: process.env.name,
      };
      const recipients = [
        {
          email: testerEmail
        }
      ];

      client
        .send({
          from: sender,
          to: recipients,
          template_uuid: process.env.template_uuid,
          template_variables: {
            "user_name": testerName,
            "next_step_link": sendLink,
            "call_link": callLink,
            "mail_link": mailLink
          }
        })
        .then(console.log, console.error);

      });
        
  
  })
