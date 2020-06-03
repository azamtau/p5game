const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
	host: '0.0.0.0', //  localhost
  	dialect: 'sqlite',
  	pool: {
    	max: 5,
    	min: 0,
    	idle: 10000
  	},
  	storage: 'db.sqlite'
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');

     Top = sequelize.define('top', {
      username: {
        type: Sequelize.STRING
      },
      score: {
        type: Sequelize.INTEGER
      }
    });
    //dbSetup();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

function dbSetup() {
    Top.sync({force: true}) 
    .then(function(){
        Top.create({ username: "Bot", score: 100}); 
	});  
}

function dbAdd(username, score) {
    Top.create({ username: username, score: score }).then(top => {
        console.log("Auto-generated ID:", top.id);
    });
}

function dbGetTop(num) {
    return Top.findAll({
        limit: num,
		order: [
            ['score', 'DESC']
        ]
	}).then(tops => tops);
}

function dbGetAll() {
    Top.findAll().then(tops => {
        tops.forEach(top => {
			console.log(top.username, top.score);
		});
    });
}

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port 3000!');
});

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

app.get('/top/:n', function(req, res) {
    //request.params.n
    dbGetTop(3).then(tops => {
        res.send({"top": JSON.stringify(tops)});
    });
});

app.post('/save', (req, res) => {
    try  {
        let username = req.body.name.toString();
        let score = parseInt(req.body.score);

        dbAdd(username, score);
        res.send({"status":"successefully saved"});
    }
    catch (e) {
        console.log("Some error occured:" + e);
        res.send("Wrong data was sent");
    } 
    
});


// > heroku config:set API_KEY=wfewe;fo8u23t3
// > heroku config