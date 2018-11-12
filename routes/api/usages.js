
module.exports = function(app){
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
}
