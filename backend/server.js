
// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const sqlServer = require('mssql');
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}));
const port = process.env.port;
app.listen(port);
//sql server

const config = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    options: {
        encrypt: false,
        trustServerCertficate: true,
        trustedConnection: true,
        enableArithAbort: true,
    },
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 8760 * 60 * 60 * 1000
    }
}));



const poolPromise = sqlServer.connect(config);
app.get('/login', (req, res) => {
    if (req.session.user)
        res.json({ login: true, message: 'good' });
    else
        res.json({ login: false });
})

app.post('/login', async (req, res) => {
    let pool = await poolPromise;
    const { email, password } = req.body;
    const request = pool.request();
    request.input('email', sqlServer.NVarChar, email);
    request.input('password', sqlServer.NVarChar, password);
    const result = await request.execute('login');
    if (result.recordset.length > 0) {
        req.session.user = result.recordset[0];
        res.json(result.recordset[0]);
    }
    else {
        res.json({ message: 'no client with this credentials' })
    }
});

app.get('/user', (req, res) => {
    const userCopy = { ...req.session.user };
    const { firstName, lastName, role } = userCopy;
    res.json({ firstName, lastName, role });
})

app.get('/permissions', async (req, res) => {
    const userCopy = { ...req.session.user };
    const { user_id } = userCopy;
    let pool = await poolPromise;
    const request = pool.request();
    request.input('user_id', sqlServer.Int, user_id);
    const result = await request.execute('selectPermissions');
    if (result.recordset.length > 0) {
        res.json(result.recordset);
    }
    else {
        res.json({ message: 'you don\'t have any permissions' });
    }
});
app.post('/addAccount', async (req, res) => {
    const { firstName, lastName, email, department, role, permissions } = req.body;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('firstName', sqlServer.VarChar(255), firstName);
        request.input('lastName', sqlServer.VarChar(255), lastName);
        request.input('email', sqlServer.VarChar(255), email);
        request.input('department', sqlServer.VarChar(255), department);
        request.input('role', sqlServer.VarChar(255), role);
        request.input('permissions', sqlServer.VarChar(255), permissions.join("-"));
        const result = await request.execute('addAccount');
        res.json({ message: "good" });
    }
    catch (err) {
        if(err.message==="permissions empty")
            res.json({ message:"permissions empty"});
        else if(err.message==="Manager obligatory for this department")
            res.json({ message:"manager obligatory"});
        else if(err.message.startsWith('Violation of UNIQUE KEY constraint'))
            res.json({ message:"error"});
        else
            res.json({message:'department manager already exist'});
    }
});

app.get('/displayAccounts', async (req, res) => {
    try {
        const userCopy = { ...req.session.user };
        const { user_id,role} = userCopy;
        let pool = await poolPromise;
        const request = pool.request();
        request.input('user_id', sqlServer.Int,user_id);
        request.input('role', sqlServer.VarChar(255),role);
        const result = await request.execute('displayUsers');
        console.log('BLOCK BLOCK BLOCK');
        res.json(result.recordset);  
    }
    catch (err) {
        res.json({message:'error'});
    }
});

app.get('/userInformation', async (req, res) => {
    try {
        const user_id=req.query.user;
        let pool = await poolPromise;
        const request = pool.request();
        request.input('user_id', sqlServer.Int,user_id);
        const result = await request.execute('userInformation');
        res.json(result.recordset);  
    }
    catch (err) {
        res.json({message:'error'});
    }
});


app.post('/updatePermissions', async (req, res) => {
    const {email,permissions}=req.body;  
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('email', sqlServer.VarChar(255), email);
        request.input('permissions', sqlServer.VarChar(900), permissions.join("-"));
        const result = await request.execute('updatePermissions');
        res.json({ message: "good" });
    }
    catch (err) {
        res.json({message:err.message});
    }
});

app.post('/block', async (req, res) => {
    const {email}=req.body;  
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('email', sqlServer.VarChar(255), email);
        const result = await request.execute('blockAccount');
        res.json({ message: "good" });
    }
    catch (err) {
        res.json({message:err.message});
    }
});






