var locker = require("../utils/locker");
var blockWait = require('../utils/blockwait')

app.route.post('/testingLocker', async function(req, cb){
    await locker('testingLocker');
    app.sdb.create("testing", {
        test: app.autoID.increment('testing_max_test'),
        value: "yo"
    });

    var autoID = app.autoID.get('testing_max_test');
    console.log("AutoID before locker: " + autoID);

    var value = await app.model.Testing.findOne({
        condition: {
            test: autoID
        }
    });

    if(value)
    console.log("Value after locker: " + value.value);

    await locker('testingLocker');
    
    var autoID = app.autoID.get('testing_max_test');
    console.log("AutoID before locker: " + autoID);

    var value = await app.model.Testing.findOne({
        test: autoID
    });

    console.log("Value after locker: " + value.value);
    
})

app.route.post('/anotherAPI', async function(req, cb){
    var value = await app.model.Testing.findOne({
        condition: {
            test: 1
        }
    });
    return value
})

app.route.post('/testingUpdateCondition', async function(req, cb){
    var array = ['a', 'aa', 'aaa', 'aaaa', 'aaaaa'];
    app.sdb.update('testing', {test: "updated"}, {
        value: {
            $in: array
        }
    })
})

app.route.post('/enterTestdata', async function(req, cb){
    for(i = 0; i < 100; i++){
        app.sdb.create('testing', {
            test: "hello " + i,
            value: i
        });
    }
});

app.route.post('/datatablestesting', async function (req, res) {
        datatablesQuery = require('datatables-query'),
        params = req.body,
        query = datatablesQuery(app.model.Testing);

    query.run(params).then(function (data) {
        return data;
    }, function (err) {
        return err;
    });
})

app.route.post('/pagenationTesting', async function(req, cb){
    var total = await app.model.Testing.count({});
    var result = await app.model.Testing.findAll({
        limit: req.query.limit,
        offset: req.query.offset
    })
    return {
        result: result,
        total: total,
        isSuccess: true
    }
})

app.route.post('/populateEmployees', async function(req, cb){
    var identity = JSON.stringify(req.query.identity);

    for(let i = 0; i < 100; i++){
        app.sdb.create('employee', {
            email: "dummyEmp" + i + "@yopmail.com",
            //empid: app.autoID.increment('employee_max_empid'),
            empid: "dummyEmpid" + i,
            name: "dummyname" + i,
            designation: "dummydesignation" + i,
            bank: "dummybank" + i,
            accountNumber: "dummyaccountNumber" + i,
            identity: identity,
            iid: req.query.iid,
            salary: "dummysalary",
            walletAddress: "dummywalletaddrss" + i,
            department: req.query.department,
            deleted: "0"
        });
    }
    await blockWait();
})


app.route.post('/populateBkvs', async function(req, cb){
    var identity = Buffer.from(JSON.stringify(req.query.identity)).toString('base64');
    var earnings = Buffer.from(JSON.stringify(req.query.earnings)).toString('base64');
    var deductions = Buffer.from(JSON.stringify(req.query.deductions)).toString('base64');
    var status = ['pending', 'authorized', 'issued']
    for(let i = 0; i < 100; i++){
        var timestamp = new Date().getTime();
        app.sdb.create('payslip', {
            pid: "" + i,
            email:"dummyemail" + i + "@yopmail.com",
            empid: "JohnBonda",
            name:"dummyname" + i,
            employer:"dummyemployer" + i,
            month: i%12,
            year:"dummyyear" + i,
            designation:"dummydesignation" + i,
            bank:"dummybank" + i,
            accountNumber:"dummyaccount" + i,
            identity: identity,
            earnings: earnings,
            deductions: deductions,
            grossSalary:"dummygross" + i,
            totalDeductions:"dummydeduction" + i,
            netSalary:"dummynetsalary" + i,
            timestampp: timestamp.toString(),
            deleted: '0'
        });

        app.sdb.create('issue', {
            pid:"" + i,
            iid: "1",
            hash: "dummyhash" + i,
            sign: "dummysign" + i,
            publickey:"dummypublickey" + i,
            timestampp:timestamp.toString(),
            status: status[i%3],
            empid: "JohnBonda",
            transactionId: '-',
            did: "1"
        })
    }

    await blockWait();
})

//damn

app.route.post("/mockEmployeeRegistration", async function(req){
    var create = {
        email: req.query.email,
        empid: req.query.empid,
        name: req.query.name,
        designation: req.query.designation,
        bank: req.query.bank,
        accountNumber: req.query.accountNumber,
        identity: JSON.stringify(req.query.identity),
        iid: req.query.iid,
        salary: req.query.salary,
        walletAddress: req.query.walletAddress,
        department: req.query.department,
        deleted: "0"
    }
    app.sdb.create('employee', create);
    await blockWait();
    return {
        isSuccess: true
    }
})