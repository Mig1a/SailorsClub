
exports.add = function(db, obj, cb) {
    // Insert new boat into database
    const sql = `INSERT INTO sailingadventure.Boats (B_Name, B_type) VALUES (?, ?)`;
    const values = [obj.B_Name, obj.B_type];
    db.query(sql, values, (err, results) => {
        if (err) {
            return cb(err.message);
        }
        // Callback with success message
        cb('Added to boats table\n');
    });
};

exports.display = function(db, cb) {
    // Retrieve all boats from the database
    const sql = `SELECT * FROM sailingadventure.Boats`;
    // Execute query to display boats
    db.query(sql, (err, results) => {
        if (err) {
            return cb(err.message);
        }
        // Callback with results
        cb(results);
    });
};

exports.delete = function(db, obj, cb) {
    // Delete boat by Boat ID
    const sql = `DELETE FROM sailingadventure.Boats WHERE B_ID = ?`;
    const values = [obj.B_ID];
    // Execute delete query
    db.query(sql, values, (err) => {
        if (err) {
            return cb(err.message);
        }
        // Callback with success message
        cb("Deleted");
    });
};

exports.update = function(db, obj, cb) {
    // Check if Boat ID exists
    let sql = `SELECT * FROM sailingadventure.Boats WHERE B_ID = ?`
    db.query(sql,[obj.B_ID],(err, result)=>{
        if (err){
            return cb(err.message)
        }else if (result && result.length == 0){
            // Callback if Boat ID does not exist
            return cb('ID does not exist')
        }else{
            // Update boat information
            let keys = Object.keys(obj)
            // Determine new values for update
            const newName = keys.includes('B_Name')? obj.B_Name : result[0].B_Name
            const newType = keys.includes('B_type')? obj.B_type : result[0].B_type
            // Construct update query
            let sql = `UPDATE sailingadventure.Boats SET B_Name = ?, B_type= ? WHERE B_ID = ?`;
            // Execute update query
            db.query(sql,[newName,newType,obj.B_ID],(err)=>{
                if(err) {
                    return cb(err.message);
                };
                // Callback with success message
                cb('Updated')
            });
        }
    });
};
