
// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const sqlServer = require('mssql');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(cors({
    origin: ["http://localhost:5173","http://192.168.100.137:5173"],
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
    request.input('email', sqlServer.VarChar(255), email);
    const result = await request.execute('login');
    if (result.recordset.length > 0 && result.recordset[0].status === 'access') {
        const hashedPassword = result.recordset[0].password;
        bcrypt.compare(password, hashedPassword, (err, response) => {
            if (response) {
                req.session.user = result.recordset[0];
                res.json(result.recordset[0]);
            }
            else {
                res.json({ message: 'no client with this credentials' })
            }
        })
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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('urbanAgency2024', saltRounds);
    const { firstName, lastName, email, department, role, permissions } = req.body;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('firstName', sqlServer.VarChar(255), firstName);
        request.input('lastName', sqlServer.VarChar(255), lastName);
        request.input('email', sqlServer.VarChar(255), email);
        request.input('department', sqlServer.VarChar(255), department);
        request.input('password', sqlServer.VarChar(255), hashedPassword);
        request.input('role', sqlServer.VarChar(255), role);
        request.input('permissions', sqlServer.VarChar(900), permissions.join("-"));
        const result = await request.execute('addAccount');
        res.json({ message: "good" });
    }
    catch (err) {
        console.log(err.message);
        if (err.message === "permissions empty")
            res.json({ message: "permissions empty" });
        else if (err.message === "Manager obligatory for this department")
            res.json({ message: "manager obligatory" });
        else if (err.message === "Department manager already exists")
            res.json({ message: 'department manager already exist' });
        else
            res.json({ message: "error" });
    }
});
app.post('/resetPassword', async (req, res) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('urbanAgency2024', saltRounds);
    const { email } = req.body;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('email', sqlServer.VarChar(255), email);
        request.input('password', sqlServer.VarChar(255), hashedPassword);
        const result = await request.execute('resetPassword');
        res.json({ message: "good" });
    }
    catch (err) {
        res.json({ message: "error" });
    }
});

app.get('/displayAccounts', async (req, res) => {
    try {
        const userCopy = { ...req.session.user };
        const { user_id, role } = userCopy;
        let pool = await poolPromise;
        const request = pool.request();
        request.input('user_id', sqlServer.Int, user_id);
        request.input('role', sqlServer.VarChar(255), role);
        const result = await request.execute('displayUsers');
        res.json(result.recordset);
    }
    catch (err) {
        res.json({ message: 'error' });
    }
});

app.get('/userInformation', async (req, res) => {
    try {
        const user_id = req.query.user;
        let pool = await poolPromise;
        const request = pool.request();
        request.input('user_id', sqlServer.Int, user_id);
        const result = await request.execute('userInformation');
        res.json(result.recordset);
    }
    catch (err) {
        res.json({ message: 'error' });
    }
});


app.post('/updatePermissions', async (req, res) => {
    const { email, permissions } = req.body;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('email', sqlServer.VarChar(255), email);
        request.input('permissions', sqlServer.VarChar(900), permissions.join("-"));
        const result = await request.execute('updatePermissions');
        res.json({ message: "good" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
});

app.post('/block', async (req, res) => {
    const { email } = req.body;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('email', sqlServer.VarChar(255), email);
        const result = await request.execute('blockAccount');
        res.json({ message: "good" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
});


app.post('/addProducts', async (req, res) => {
    const { nameProduct, category, quantity } = req.body;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('product', sqlServer.VarChar(500), nameProduct);
        request.input('category', sqlServer.VarChar(300), category);
        request.input('quantity', sqlServer.Int, quantity);
        const result = await request.execute('addProducts');
        console.log('goooooooood');
        res.json({ message: "good" });
    }
    catch (err) {
        console.log(err);
        res.json({ message: "errorrr" });
    }
});
app.post('/displayProducts', async (req, res) => {
    const { category } = req.body;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('category', sqlServer.VarChar(500), category);
        const result = await request.execute('selectProducts');
        res.json(result.recordset);
    }
    catch (err) {
        res.json({ message: "errorjdfdhf" });
    }
});
app.post('/modifyQuantity', async (req, res) => {
    const { productTitle, newQuantity } = req.body;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        console.log(newQuantity);
        console.log(productTitle);
        request.input('productTitle', sqlServer.VarChar(700), productTitle);
        request.input('newQuantity', sqlServer.Int, newQuantity);
        const result = await request.execute('updateQuantity');
        res.json({ message: "good" });
    }
    catch (err) {
        console.log(err);
        res.json({ message: "errorjdfdhf" });
    }
});

app.post('/sendPurchaseOrder', async (req, res) => {
    const userCopy = { ...req.session.user };
    const { user_id } = userCopy;
    let count = 0;
    try {
        const promises = req.body.map(async obj => {
            try {
                let pool = await poolPromise;
                const request = pool.request();
                request.input('user_id', sqlServer.Int, user_id); // You can replace 1 with dynamic user_id if needed
                request.input('product', sqlServer.VarChar(1000), obj.product);
                request.input('quantityReserved', sqlServer.Int, obj.qtReserved);

                const result = await request.execute('addReservation');
                count++;
            } catch (err) {
                console.log(err);
            }
        });

        // Wait for all promises to resolve
        await Promise.all(promises);

        if (req.body.length === count) {
            res.json({ message: 'good' });
        } else {
            res.json({ message: 'error' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});



app.get('/viewRequestOfDepartment', async (req, res) => {
    const userCopy = { ...req.session.user };
    const { dep_id } = userCopy;
    let count = 0;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('dep_id', sqlServer.Int, dep_id);
        const result = await request.execute('viewRequestOfDepartment');
        res.json(result.recordset);
    }
    catch (err) {
        console.log(err);
    }
});

app.post('/acceptRequest', async (req, res) => {
    const { user_id, quantity_reserved, product } = req.body;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('user_id', sqlServer.Int, user_id);
        request.input('quantity_reserved', sqlServer.Int, quantity_reserved);
        request.input('product', sqlServer.VarChar(255), product);
        const result = await request.execute('acceptRequest');
        res.json({ message: "good" });
    }
    catch (err) {
        console.log(err.message);
        res.json({ message: "error" });
    }
});
app.post('/rejectRequest', async (req, res) => {
    const { user_id } = req.body;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('user_id', sqlServer.Int, user_id);
        const result = await request.execute('rejectRequest');
        res.json({ message: "good" });
    }
    catch (err) {
        console.log(err);
        res.json({ message: "error" });
    }
});

app.get('/displayValidateRequests', async (req, res) => {
    try {
        let pool = await poolPromise;
        const request = pool.request();
        const result = await request.execute('displayValidateRequests');
        res.json(result.recordset);
    }
    catch (err) {
        console.log(err);
    }
});
app.post('/validateRequests', async (req, res) => {
    const { reservationId, product, reservedQuantity } = req.body;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('reservation_id', sqlServer.Int, reservationId);
        request.input('quantityReserved', sqlServer.Int, reservedQuantity);
        request.input('product', sqlServer.VarChar(255), product);
        const result = await request.execute('validateRequest');
        res.json({ message: 'good' });
    }
    catch (err) {
        res.json({ message: 'not good' });
    }
});

app.post('/refuseRequests', async (req, res) => {
    const { reservationId } = req.body;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('reservationId', sqlServer.Int, reservationId);
        const result = await request.execute('refuseRequest');
        res.json({ message: 'good' });
    }
    catch (err) {
        console.log(err);
        res.json({ message: 'not good' });
    }
});
app.get('/stateOfMyRequests', async (req, res) => {
    const userCopy = { ...req.session.user };
    const { user_id } = userCopy;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('user_id', sqlServer.Int, user_id);
        const result = await request.execute('StateOfMyRequests');
        res.json(result.recordset);
    }
    catch (err) {
        console.log(err);
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error in destroying session');
        }
        res.clearCookie('connect.sid'); // Optional: Clear session cookie from the browser
        res.send({ message: "good" });
    });
});


app.post('/changePassword', async (req, res) => {
    const userCopy = { ...req.session.user };
    const { user_id } = userCopy;
    const { password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('user_id', sqlServer.Int, user_id);
        request.input('hashedPassword', sqlServer.VarChar(255), hashedPassword);
        const result = await request.execute('changePassword');
        res.json({ message: "good" });
    }
    catch (err) {
        res.json({ message: "error" });
    }
});


app.get('/catchReservationDates', async (req, res) => {
    const userCopy = { ...req.session.user };
    const { dep_id } = userCopy;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('dep_id', sqlServer.Int, dep_id);
        const result = await request.execute('catchReservationDates');
        res.json(result.recordset);
    }
    catch (err) {
        console.log(err);
    }
});
app.get('/departmentReport', async (req, res) => {
    const { year } = req.query;
    const userCopy = { ...req.session.user };
    const { dep_id } = userCopy;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('dep_id', sqlServer.Int, dep_id);
        request.input('year', sqlServer.Int, year);
        const result = await request.execute('departmentReport');
        res.json(result.recordset);
    }
    catch (err) {
        console.log(err);
    }
});

app.post('/purchaseOrderForStock', async (req, res) => {
    const { purchaseOrder, supplier } = req.body;
    const { company_name, adress, city, phone_number, fax } =supplier;
    let purchaseOrderId=0;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('business_name', sqlServer.VarChar(255),company_name);
        request.input('adress', sqlServer.VarChar(255),adress);
        request.input('city', sqlServer.VarChar(255),city);
        request.input('phone_number', sqlServer.VarChar(255),phone_number);
        request.input('fax', sqlServer.VarChar(255),fax);
        const result = await request.execute('addSupplier');
        console.log(result.recordset);
        purchaseOrderId=result.recordset[0].purchaseOrder_id;
    } catch (err) {
        console.log(err);
    }
    let count = 0;
    try {
        const promises = purchaseOrder.map(async obj => {
            try {
                let pool = await poolPromise;
                const request = pool.request();
                request.input('product', sqlServer.VarChar(255),obj.product);
                request.input('purchaseOrderId', sqlServer.Int,purchaseOrderId);
                request.input('newQuantity', sqlServer.Int,obj.qtReserved);
                const result = await request.execute('addPurchaseOrderReport');
                count++;
            } catch (err) {
                console.log(err);
            }
        });

        // Wait for all promises to resolve
        await Promise.all(promises);

        if (req.body.length === count) {
            res.json({ message: 'good' });
        } else {
            res.json({ message: 'error' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


app.get('/reportForStock', async (req, res) => {
    try {
        let pool = await poolPromise;
        const request = pool.request();
        const result = await request.execute('reportForStock');
        res.json(result.recordset);
    }
    catch (err) {
        console.log(err);
    }
});


app.get('/catchPurchaseOrderDates', async (req, res) => {
    try {
        let pool = await poolPromise;
        const request = pool.request();
        const result = await request.execute('catchPurchaseOrderDates');
        res.json(result.recordset);
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/generatePurchaseOrderReport', async (req, res) => {
    const { year } = req.query;
    try {
        let pool = await poolPromise;
        const request = pool.request();
        request.input('year', sqlServer.Int, year);
        const result = await request.execute('generatePurchaseOrderReport');
        console.log(result.recordset);
        res.json(result.recordset);
    }
    catch (err) {
        console.log(err);
    }
});
