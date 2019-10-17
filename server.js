require('dotenv').config(); // to access .env private secrets n stuff
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const oracledb = require('oracledb');

const app = express();

// CONFIG
// Passport config
require('./config/passport')(passport);

// MIDDLEWARE
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
	session({
		secret: 'iЛoveJesus',
		resave: true,
		saveUninitialized: true
	})
);
app.use(express.static('public'));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars - my middleware
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

// Ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Routes - templating
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Routes - mongoApi
app.use('/api/auth', require('./routes/api/users'));
app.use('/api/beds', require('./routes/api/beds'));

app.get('/api', (req, res) => {
	res.json({
		msg: 'welcome to deep ai...',
		like: req.query.like,
		col: req.query.col
	});
});

//GET markets - oracleApi
app.get('/api/markets', (req, res) => {
	//fetch all including korogocho, :)

	var params = req.query;

	var isSearching = !(params.like == undefined);
	var dbColSet = !(params.col == undefined);

	if (isSearching && dbColSet) {
		console.log(`!!trying to search db for [${params.like}] in field [${params.col}]`);
	}

	getMarkets(req, res, params.like, params.col);
});

//GET estates - oracleApi
app.get('/api/estates', (req, res) => {
	//fetch all including huruma, :)

	var params = req.query;

	var isSearching = !(params.like == undefined);
	var dbColSet = !(params.col == undefined);

	if (isSearching && dbColSet) {
		console.log(`!!trying to search db for [${params.like}] in field [${params.col}]`);
	}

	getEstates(req, res, params.like, params.col);
});

//GET citizens - oracleApi
app.get('/api/citizens', (req, res) => {
	//fetch all including tamara davis, :)

	var params = req.query;

	var isSearching = !(params.like == undefined);
	var dbColSet = !(params.col == undefined);

	if (isSearching && dbColSet) {
		console.log(`!!trying to search db for [${params.like}] in field [${params.col}]`);
	}

	getCitizens(req, res, params.like, params.col);
});

//quests..
async function getMarkets(req, res, searchTerm, searchCol) {
	const ORA_CONN = await connOracle();
	let tableOfInterest = 'set_market_names';
	var searchableFields = [ 'set_market_name_id', 'market_name', 'created_date', 'modified_date' ];

	var truth1 = !(searchTerm == undefined);
	var truth2 = !(searchCol == undefined);
	var truth3 = false;

	if (truth1 && truth2) {
		searchCol = searchCol.toLowerCase();
		truth3 = searchableFields.includes(searchCol);
		if (!truth3) {
			console.log(`!!asalm aleikum bitch, field [${searchCol}] does not exist at al..`);
		}
	}

	isSearching = truth1 && truth2 && truth3;

	try {
		let sql = `SELECT * FROM ${tableOfInterest}`;
		let binds = {};
		let options = { outFormat: oracledb.OBJECT };

		if (isSearching) {
			sql = `SELECT * FROM ${tableOfInterest} WHERE ${searchCol} LIKE :mybv`;
			binds = { mybv: `%${searchTerm}%` };
			console.log('Searching..');
		} else {
			console.log('Not Searching..');
		}

		result = await ORA_CONN.execute(sql, binds, options);
		connOracleRelease(ORA_CONN);

		if (result.rows.length == 0) {
			return res.json({
				data: result.rows,
				msg: 'no results matching your query',
				total_results: result.rows.length,
				code: 0
			});
		} else {
			return res.send({ data: result.rows, msg: 'success', total_results: result.rows.length, code: 1 });
		}
	} catch (err) {
		return res.send(err.message);
	}
}

async function getEstates(req, res, searchTerm, searchCol) {
	const ORA_CONN = await connOracle();
	let tableOfInterest = 'set_estates';
	var searchableFields = [ 'estate_id', 'estate_name', 'created_date', 'modified_date' ];

	var truth1 = !(searchTerm == undefined);
	var truth2 = !(searchCol == undefined);
	var truth3 = false;

	if (truth1 && truth2) {
		searchCol = searchCol.toLowerCase();
		truth3 = searchableFields.includes(searchCol);
		if (!truth3) {
			console.log(`!!asalm aleikum bitch, field [${searchCol}] does not exist at al..`);
		}
	}

	isSearching = truth1 && truth2 && truth3;

	try {
		let sql = `SELECT * FROM ${tableOfInterest}`;
		let binds = {};
		let options = { outFormat: oracledb.OBJECT };

		if (isSearching) {
			sql = `SELECT * FROM ${tableOfInterest} WHERE ${searchCol} LIKE :mybv`;
			binds = { mybv: `%${searchTerm}%` };
			console.log('Searching..');
		} else {
			console.log('Not Searching..');
		}

		result = await ORA_CONN.execute(sql, binds, options);
		connOracleRelease(ORA_CONN);

		if (result.rows.length == 0) {
			return res.json({
				data: result.rows,
				msg: 'no results matching your query',
				total_results: result.rows.length,
				code: 0
			});
		} else {
			return res.send({ data: result.rows, msg: 'success', total_results: result.rows.length, code: 1 });
		}
	} catch (err) {
		return res.send(err.message);
	}
}

async function getCitizens(req, res, searchTerm, searchCol) {
	const ORA_CONN = await connOracle();
	let tableOfInterest = 'reg_clients';
	var searchableFields = [
		'client_id',
		'client_name',
		'email',
		'mobile_number',
		'telephone_number',
		'pin_number',
		'created_date',
		'modified_date'
	];

	var truth1 = !(searchTerm == undefined);
	var truth2 = !(searchCol == undefined);
	var truth3 = false;

	if (truth1 && truth2) {
		searchCol = searchCol.toLowerCase();
		truth3 = searchableFields.includes(searchCol);
		if (!truth3) {
			console.log(`!!asalm aleikum bitch, field [${searchCol}] does not exist at al..`);
		}
	}

	isSearching = truth1 && truth2 && truth3;

	try {
		let sql = `SELECT * FROM ${tableOfInterest}`;
		let binds = {};
		let options = { outFormat: oracledb.OBJECT };

		if (isSearching) {
			sql = `SELECT * FROM ${tableOfInterest} WHERE ${searchCol} LIKE :mybv`;
			binds = { mybv: `%${searchTerm}%` };
			console.log('Searching..');
		} else {
			console.log('Not Searching..');
		}

		result = await ORA_CONN.execute(sql, binds, options);
		connOracleRelease(ORA_CONN);

		if (result.rows.length == 0) {
			return res.json({
				data: result.rows,
				msg: 'no results matching your query',
				total_results: result.rows.length,
				code: 0
			});
		} else {
			return res.send({ data: result.rows, msg: 'success', total_results: result.rows.length, code: 1 });
		}
	} catch (err) {
		return res.send(err.message);
	}
}

// Database - oracle
async function connOracle() {
	return await oracledb.getConnection({
		user: process.env.ORA_USER,
		password: process.env.ORA_PSWD,
		connectString: process.env.ORA_CONN_STRING
	});
}

function connOracleRelease(connection) {
	connection.close(function(err) {
		if (err) {
			console.error(err.message);
		}
	});
}

// Database - mongo atlas
const db = process.env.MONGO_URI;
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('MongoDb connected...'))
	.catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Passportjs server running on port ${PORT}..`);
});
