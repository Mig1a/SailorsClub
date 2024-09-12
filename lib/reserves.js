// Million Aboye
// Assignment 3
// 4/22/2024
exports.add = function(db, obj, cb) {
  // Check if the Sailor ID exists
  let sqlCheckS_ID = `SELECT * FROM sailingadventure.Sailors WHERE S_ID = ?`;
  let sqlCheckB_ID = `SELECT * FROM sailingadventure.Boats WHERE B_ID = ?`;

  db.query(sqlCheckS_ID, [obj.S_ID], (err, resultS) => {
      if (err) {
          return cb(err.message);
      }
      if (resultS.length === 0) {
          return cb('S_ID does not exist');
      }

      // Check if the Boat ID exists
      db.query(sqlCheckB_ID, [obj.B_ID], (err, resultB) => {
          if (err) {
              return cb(err.message);
          }
          if (resultB.length === 0) {
              return cb('B_ID does not exist');
          }

          // Insert reservation into database
          let sqlInsert = `INSERT INTO sailingadventure.Reserves (S_ID, B_ID, date) VALUES (?, ?, ?)`;
          const values = [obj.S_ID, obj.B_ID, obj.date];
          db.query(sqlInsert, values, (err, results) => {
              if (err) {
                  return cb(err.message);
              }
              // Callback with success message
              cb('Reserve added');
          });
      });
  });
};


exports.display = function(db, cb) {
  // Retrieve reservations with sailor and boat details
  const sql = `SELECT s.S_name, b.B_Name, r.S_ID, r.B_ID,r.date 
  FROM sailingadventure.Reserves AS r 
  JOIN sailingadventure.Sailors AS s ON r.S_ID = s.S_ID
  JOIN sailingadventure.Boats AS b ON r.B_ID = b.B_ID`;
  
  // Execute query to display reservations
  db.query(sql, (err, results) => {
      if (err) throw err;
      // Format dates to strings
      results.forEach(result => {
          result.date = result.date.toDateString();
      });
      // Callback with results
      cb(results);
  });
};

exports.delete = function(db, obj, cb) {
  // Determine if deletion is by Sailor ID or Boat ID
  let sql, values;
  if (obj.S_ID !== undefined) {
      sql = `DELETE FROM sailingadventure.Reserves WHERE S_ID = ?`;
      values = [obj.S_ID];
  } else if (obj.B_ID !== undefined) {
      sql = `DELETE FROM sailingadventure.Reserves WHERE B_ID = ?`;
      values = [obj.B_ID];
  }
  // Execute delete query
  db.query(sql, values, (err) => {
      if (err) {
          return cb(err.message);
      }
      // Callback with success message
      cb("Deleted");
  });
};


