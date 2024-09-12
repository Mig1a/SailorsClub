// Million Aboye
// Assignment 3
// 4/22/2024
exports.add = function(db, obj, cb) {
  // Insert new sailor into database
  const sql = `INSERT INTO sailingadventure.Sailors (S_name, B_date, Rate) VALUES (?, ?, ?)`;
  const values = [obj.S_name, obj.B_date, obj.Rate];
  db.query(sql, values, (err, results) => {
      if (err) {
          return cb(err.message);
      }
      // Callback with success message
      cb('Added\n');
  });
};

exports.display = function(db, cb) {
  // Retrieve all sailors from the database
  const sql = `SELECT * FROM sailingadventure.Sailors`;
  // Execute query to display sailors
  db.query(sql, (err, results) => {
      if (err) throw err;
      // Format birth dates to strings
      results.forEach(result => {
          result.B_date = result.B_date.toDateString();
      });
      // Callback with results
      cb(results);
  });
};

exports.delete = function(db, obj, cb) {
  // Delete sailor by Sailor ID
  const sql = `DELETE FROM sailingadventure.Sailors WHERE S_ID = ?`;
  const values = [obj.S_ID];
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
  // Check if Sailor ID exists
  let sql = `SELECT * FROM sailingadventure.Sailors WHERE S_ID = ?`
  db.query(sql,[obj.S_ID],(err, result) => {
      if (err){
          return cb(err.message)
      }else if (result && result.length == 0){
          // Callback if Sailor ID does not exist
          return cb('ID does not exist')
      }else{
          // Update sailor information
          let keys = Object.keys(obj)
          // Determine new values for update
          const newName = keys.includes('S_name')? obj.S_name: result[0].S_name
          const newdate = keys.includes('B_date')? obj.B_date : result[0].B_date
          const newRate = keys.includes('Rate')? obj.Rate : result[0].Rate
          // Construct update query
          let sql = `UPDATE sailingadventure.Sailors SET S_name = ?, B_date = ?, Rate = ? WHERE S_ID = ?`;
          // Execute update query
          db.query(sql,[newName,newdate,newRate,obj.S_ID],(err)=>{
              if(err) {
                  return cb(err.message);
              };
              // Callback with success message
              cb('Updated')
          });
      }
  });
};
