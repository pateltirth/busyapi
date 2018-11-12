You can not scale with existing functionality, So first thing you need is proper storing mechanism. 

- Introducing MongoDB for storing the request data
- creating schema Usage in DB 
- Schema Usage will look like this
 {
	_id: primary key (auto generated with mongodb),
	id: usageid(incremental value),
	patientId: patientId,
	medication: medication,
	timestamp: timestamp
 }

- Now we need to change the POST api/usages with using the database
- So I updated the POST api/usages
- I have also created a Counter collection for autoincrement the usageId
- UPDATE MADE in API::::: 

    app.post('/api/usages', function(req, res){

        //console.log("reqest - ", req.body.patientId);
        //Now we should be using the database 
        // Store the supplied usage data into database

        app.counterModel.findByIdAndUpdate(
            {_id: 'usageId'}, 
            {$inc: { seq: 1} }, 
            {new: true, upsert: true},
            function(error, counter)   {
                if(error)
                    return next(error);
                //console.log(counter);
                var savedata = new app.usageModel({
                    'usageId': counter.seq,
                    'patientId': req.body.patientId,
                    'timestamp': req.body.timestamp,
                    'medication': req.body.medication
                }).save(function(err, result) {
                    if (err) throw err;
                    if(result) {
                        res.status(201).json({'id':result.usageId});
                    }
                })
        });
    });


So now, Steps to start the server
1. Download the mongoDB
2. Start mongoDB by command "mongod"
3. Start server by command "npm start"
4. Now send POST apis either through curl or postman
5. see the response comming
6. Also, see the collection Usage in mongodb with all the entries



Further updates that we can make, 
- Multithreded server for handling more requests 
- Also, intoducing load balancer before multi instance servers 
